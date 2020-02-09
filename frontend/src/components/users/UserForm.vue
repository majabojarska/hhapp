<template>
  <v-card>
    <v-card-title>
      <v-btn text class="mr-4" icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      User
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" ref="form" @keypress.enter="submit" action="">
        <v-row v-if="type == FormType.Create">
          <v-col :cols="12" :sm="6">
            <v-text-field
              v-model="editUser.username"
              label="Username"
              prepend-icon="mdi-account"
              :rules="rules.required"
            >
            </v-text-field>
          </v-col>
          <v-col :cols="12" :sm="6">
            <v-text-field
              v-model="editUser.password"
              label="Password"
              prepend-icon="mdi-lock"
              :rules="rules.password"
              type="password"
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :sm="6">
            <v-text-field
              v-model="editUser.firstname"
              label="Firstname"
              prepend-icon="mdi-account"
              :rules="rules.required"
            ></v-text-field>
          </v-col>
          <v-col :cols="12" :sm="6">
            <v-text-field
              v-model="editUser.surname"
              label="Surname"
              prepend-icon="mdi-account"
              :rules="rules.required"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :sm="6">
            <v-menu
              v-model="datepicker"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="editUser.dateOfBirth"
                  label="Date of birth"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  :rules="rules.required"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="editUser.dateOfBirth"
                @input="datepicker = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex justify-start align-center" :cols="12" :sm="6">
            <v-icon class="mr-2">mdi-palette</v-icon>
            <v-color-picker
              class="flex-grow-1"
              v-model="editUser.color"
              hide-canvas
              hide-inputs
              hide-swatches
            ></v-color-picker>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="12" :md="6">
            <v-checkbox
              v-model="editUser.isAdmin"
              label="Administrator"
              :disabled="
                !(
                  loggedUser.isAdmin &&
                  (editUser.id !== loggedUser.id || type === FormType.Create)
                )
              "
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('close')" text>Cancel</v-btn>
      <v-btn @click="submit" text>Save</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import axios, { AxiosResponse } from "axios";
import { User, UserDecorated } from "../../store/modules/user/types";
import { Getter } from "vuex-class";
import moment from "moment";
import { Watch } from "vue-property-decorator";
import { FormType } from "../../common/enums";
@Component({
  name: "UserForm",
  props: {
    user: Object as () => User | null,
    type: String
  },
  data: () => ({
    FormType
  })
})
export default class extends Vue {
  @Getter("user", { namespace: "user" }) loggedUser!: User;
  editUser: User | null = null;
  datepicker: boolean = false;
  valid: boolean = false;

  readonly rules = {
    required: [(v: string) => !!v || "Field is required!"],
    password: [
      (v: string) => !!v || "Password is required!",
      (v: string) => /\S{8,}/g.test(v) || "Password is too short!"
    ]
  };

  submit() {
    if (this.$refs.form) {
      (this.$refs.form as any).validate();
      if (this.valid) {
        this.$emit("submit", this.editUser);
      }
    }
  }

  @Watch("user", { immediate: true })
  onUserChanged() {
    this.editUser = { ...(this as any).user };
    if (this.editUser)
      this.editUser.dateOfBirth = moment(this.editUser.dateOfBirth).format(
        "YYYY-MM-DD"
      );
  }
}
</script>
