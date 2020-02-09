<template>
  <v-app>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" class="ma-0" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>HouseholdApp</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-img
                  max-height="100px"
                  contain
                  src="@/assets/hhapp_logo_alpha.png"
                  class="mb-4"
                ></v-img>
                <v-form
                  v-model="valid"
                  ref="form"
                  @keypress.enter="submit"
                  action=""
                >
                  <v-text-field
                    label="Username"
                    prepend-icon="mdi-account"
                    v-model="username"
                    :rules="usernameRules"
                    @keypress.enter="submit"
                  ></v-text-field>
                  <v-text-field
                    label="Password"
                    prepend-icon="mdi-lock"
                    v-model="password"
                    type="password"
                    :rules="passwordRules"
                    @keypress.enter="submit"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  type="submit"
                  class="float-right"
                  color="primary"
                  @click="submit"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-dialog v-model="dialogVisible" max-width="400px">
      <v-card>
        <v-card-title>
          Error
        </v-card-title>
        <v-card-text>
          {{ dialog }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="dialog = false"
            class="float-right"
            color="default"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Action } from "vuex-class";
@Component({
  name: "Login"
})
export default class extends Vue {
  @Action("login", { namespace: "user" }) login!: (p: any) => Promise<any>;

  username: string = "";
  readonly usernameRules = [(v: any) => !!v || "Username is required!"];
  password: string = "";
  readonly passwordRules = [(v: any) => !!v || "Password is required!"];

  valid: boolean = false;
  dialog: boolean | string = false;
  get dialogVisible() {
    return !!this.dialog;
  }

  submit() {
    const form = this.$refs.form as any;
    form.validate();
    if (this.valid) {
      const username = this.username;
      const password = this.password;
      this.login({ username, password })
        .then(() => {
          this.$router.push("/");
        })
        .catch((err: any) => {
          switch (true) {
            case err.response.status < 500:
              this.dialog = "Invalid username or password!";
              break;
            case err.response.status >= 500:
              this.dialog = "Server error!";
              break;
          }
        });
    }
  }
}
</script>
