<template>
  <v-container :class="{ 'px-0': $vuetify.breakpoint.xsOnly }">
    <v-card v-if="users.length > 0">
      <v-list>
        <v-list-item
          v-for="user in usersDecorated"
          :key="user.id"
          @click.stop="edit(user)"
        >
          <v-list-item-avatar :color="user.color">
            <span :class="[user.textColorClass]">
              {{ user.initials }}
            </span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ user.fullname }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="user.isAdmin"
              >Administrator</v-list-item-subtitle
            >
          </v-list-item-content>
          <v-list-item-action @click.stop>
            <v-menu bottom left @click.stop>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="option in options"
                  :key="option.label"
                  @click.stop="option.action(user.id)"
                >
                  <v-list-item-title>{{ option.label }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-snackbar v-model="snackbarVisible">
        {{ snackbarMessage }}
        <v-btn dark @click="snackbarVisible = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-card>
    <v-card v-else>
      <v-card-text class="title flex-column d-flex align-center">
        <v-icon size="80">mdi-account-multiple</v-icon>
        List empty
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialogVisible"
      max-width="800px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <user-form
        :user="dialogUser"
        @close="dialogVisible = false"
        :type="formType"
        @submit="submit"
      />
    </v-dialog>
    <v-btn
      @click="create"
      color="primary"
      fab
      fixed
      right
      bottom
      :disabled="loggedUser && !loggedUser.isAdmin"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios, { AxiosResponse } from "axios";
import { User, UserDecorated } from "../store/modules/user/types";
import { Getter, Action } from "vuex-class";
import UserService from "../store/modules/user/services/UserService";
import UserForm from "../components/users/UserForm.vue";
import { FormType } from "../common/enums";
@Component({
  name: "Users",
  components: { UserForm }
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  @Getter("user", { namespace: "user" }) loggedUser!: User;
  @Action("fetchUser", { namespace: "user" }) fetchLoggedUser!: () => void;
  users: UserDecorated[] = [];
  dialogUser: User | null = null;
  dialogVisible: boolean = false;
  snackbarVisible: boolean = false;
  snackbarMessage: string = "";
  formType: FormType = FormType.Edit;

  get usersDecorated() {
    return this.users.map(UserService.getDecorated);
  }

  options = [
    {
      label: "Delete",
      action: (id: number) => {
        console.log(id);
        this.delete(id);
      }
    }
  ];

  canEdit(user: User): boolean | string {
    if (this.loggedUser.id === user.id) return true;
    if (!this.loggedUser.isAdmin) {
      return "Cannot edit another account unpriviledged!";
    } else if (user.isAdmin && this.loggedUser.isAdmin) {
      return "Cannot edit another administrator account!";
    }
    return true;
  }

  edit(user: User) {
    const canEditResult = this.canEdit(user);
    if (canEditResult === true) {
      this.formType = FormType.Edit;
      this.dialogUser = { ...user };
      this.dialogVisible = true;
    } else {
      this.snackbarMessage = canEditResult.toString();
      this.snackbarVisible = true;
    }
  }

  create() {
    this.formType = FormType.Create;
    this.dialogUser = {
      username: "",
      password: "",
      firstname: "",
      surname: "",
      color: "#bada55",
      dateOfBirth: "1970-01-01",
      isAdmin: false
    };
    this.dialogVisible = true;
  }

  submit(user: User) {
    switch (this.formType) {
      case FormType.Create:
        axios
          .post("users", user, { headers: { Authorization: this.authHeader } })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchUsers();
            this.showSnackbar("User created!");
          })
          .catch(err => {
            console.log(err.response.data);
            if (err.response.status == 409) {
              this.showSnackbar("Username exists!");
            }
          });
        break;
      case FormType.Edit: {
        delete user.username;
        delete user.password;
        axios
          .put(`users/${user.id}`, user, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchUsers();
            this.showSnackbar("User updated!");
            if (user.id === this.loggedUser.id) {
              this.fetchLoggedUser();
            }
          })
          .catch(err => {
            console.log(err.response.data);
            if (err.response.status == 409) {
              this.showSnackbar("Username exists!");
            }
          });
        break;
      }
    }
  }

  fetchUsers() {
    axios
      .get("users", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.users = response.data;
      });
  }

  delete(id: number) {
    axios
      .delete(`users/${id}`, { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.showSnackbar("User deleted.");
        this.fetchUsers();
      });
  }

  showSnackbar(message: string) {
    this.snackbarMessage = message;
    this.snackbarVisible = true;
  }

  mounted() {
    this.fetchUsers();
  }
}
</script>
