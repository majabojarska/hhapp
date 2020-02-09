<template>
  <v-container :class="{ 'px-0': $vuetify.breakpoint.xsOnly }">
    <v-card v-if="categories.length > 0">
      <v-list>
        <v-list-item
          v-for="category in categories"
          :key="category.id"
          @click.stop="edit(category)"
        >
          <v-list-item-avatar :color="category.color">
            <span :class="[TextService.textColorClass(category.color)]">
              {{ category.name[0].toUpperCase() }}</span
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ category.name }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="category.isShared">
              Shared
            </v-list-item-subtitle>
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
                  @click.stop="option.action(category.id)"
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
        <v-icon size="80">mdi-shape</v-icon>
        List empty
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="dialogVisible"
      max-width="800px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <category-form
        :category="dialogCategory"
        @close="dialogVisible = false"
        :type="formType"
        @submit="submit"
      />
    </v-dialog>
    <v-btn @click="create" color="primary" fab fixed right bottom>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from "vue";
import Component from "vue-class-component";
import { Action, Getter } from "vuex-class";
import { Category } from "../store/modules/category/types";
import TextService from "../common/services/TextService";
import axios, { AxiosResponse } from "axios";
import { FormType } from "../common/enums";
import CategoryForm from "../components/categories/CategoryForm.vue";
import { log } from "util";
@Component({
  name: "Categories",
  components: {
    CategoryForm
  },
  data: () => ({
    TextService
  })
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  categories: Category[] = [];
  dialogCategory: Category | null = null;
  dialogVisible: boolean = false;
  snackbarVisible: boolean = false;
  snackbarMessage: string = "";
  formType: FormType = FormType.Edit;

  options = [
    {
      label: "Delete",
      action: (id: number) => {
        this.delete(id);
      }
    }
  ];

  fetchCategories() {
    axios
      .get("categories", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.categories = response.data;
      });
  }

  edit(category: Category) {
    this.formType = FormType.Edit;
    this.dialogCategory = { ...category };
    this.dialogVisible = true;
  }

  create() {
    console.log(this.dialogVisible);

    this.formType = FormType.Create;
    this.dialogCategory = {
      name: "",
      color: "#BADA55",
      isShared: false
    };
    this.dialogVisible = true;
  }

  submit(category: Category) {
    switch (this.formType) {
      case FormType.Create:
        axios
          .post("categories", category, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchCategories();
            this.showSnackbar("Category created!");
          })
          .catch(err => {
            console.log(err.response.data);
            this.showSnackbar("Server error!");
          });
        break;
      case FormType.Edit: {
        axios
          .put(`categories/${category.id}`, category, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchCategories();
            this.showSnackbar("Category updated!");
          })
          .catch(err => {
            console.log(err.response.data);
            this.showSnackbar("Server error!");
          });
        break;
      }
    }
  }

  delete(id: number) {
    axios
      .delete(`categories/${id}`, {
        headers: { Authorization: this.authHeader }
      })
      .then((response: AxiosResponse) => {
        this.showSnackbar("Category deleted.");
        this.fetchCategories();
      })
      .catch(error => {
        if (error.response.status == 406) {
          this.showSnackbar(
            "Cannot delete category! Other items depend on it."
          );
        }
      });
  }

  mounted() {
    this.fetchCategories();
  }

  showSnackbar(message: string) {
    this.snackbarMessage = message;
    this.snackbarVisible = true;
  }
}
</script>
