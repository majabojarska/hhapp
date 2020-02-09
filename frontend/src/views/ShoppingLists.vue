<template>
  <v-container :class="{ 'px-0': $vuetify.breakpoint.xsOnly }">
    <v-card v-if="shoppingLists.length > 0">
      <v-list>
        <v-list-group
          v-for="shoppingList in shoppingLists"
          :key="shoppingList.id"
        >
          <template v-slot:activator>
            <v-list-item-content @click.stop="edit(shoppingList)">
              <v-list-item-title>
                {{ shoppingList.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-icon small>mdi-cart</v-icon>
                {{ shoppingList.items.length }}
                <template v-if="shoppingList.shop">
                  <v-icon small class="ml-2">mdi-store</v-icon>
                  {{ shoppingList.shop.name }}
                </template>
                <template v-if="shoppingList.user">
                  <v-icon small class="ml-2">mdi-account</v-icon>
                  {{
                    `${shoppingList.user.firstname} ${shoppingList.user.surname}`
                  }}
                </template>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action @click.stop>
              <v-menu bottom left @click.stop>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click.stop>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="option in options"
                    :key="option.label"
                    @click.stop="option.action(shoppingList.id, shoppingList)"
                  >
                    <v-list-item-title>{{ option.label }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </template>
          <v-list-item
            v-for="item in shoppingList.items"
            :key="item.id"
            @click="() => {}"
          >
            <v-list-item-content class="ml-sm-8" @click="editItem(item)">
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.quantity }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action @click.stop>
              <v-menu bottom left @click.stop>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click.stop>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="option in optionsItem"
                    :key="option.label"
                    @click.stop="option.action(item.id)"
                  >
                    <v-list-item-title>{{ option.label }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
          <v-card flat v-if="shoppingList.items.length == 0">
            <v-card-text class="title flex-column d-flex align-center">
              <v-icon size="40">mdi-clipboard-list</v-icon>
              List empty
            </v-card-text>
          </v-card>
          <v-btn
            small
            @click="createItem(shoppingList)"
            color="accent"
            fab
            absolute
            right
            bottom
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-list-group>
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
      <shopping-list-form
        :shopping-list="dialogShoppingList"
        @close="dialogVisible = false"
        :type="formType"
        @submit="submit"
      />
    </v-dialog>
    <v-dialog
      v-model="dialogVisibleItem"
      max-width="800px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <shopping-list-item-form
        :shopping-list-item="dialogShoppingListItem"
        @close="dialogVisibleItem = false"
        :type="formType"
        @submit="submitItem"
      />
    </v-dialog>
    <v-dialog
      v-model="dialogVisibleConvert"
      max-width="800px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
    >
      <shopping-list-to-purchases-form
        :shopping-list="dialogShoppingListConvert"
        @close="dialogVisibleConvert = false"
        @submit="convert"
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
import {
  ShoppingList,
  ShoppingListItem
} from "../store/modules/shoppingList/types";
import TextService from "../common/services/TextService";
import axios, { AxiosResponse } from "axios";
import { FormType } from "../common/enums";
import ShoppingListForm from "../components/shoppingLists/ShoppingListForm.vue";
import ShoppingListItemForm from "../components/shoppingLists/ShoppingListItemForm.vue";
import ShoppingListToPurchasesForm from "../components/shoppingLists/ShoppingListToPurchasesForm.vue";
import { log } from "util";
import { Purchase } from "../store/modules/purchase/types";
@Component({
  name: "ShoppingLists",
  components: {
    ShoppingListForm,
    ShoppingListItemForm,
    ShoppingListToPurchasesForm
  },
  data: () => ({
    TextService
  })
})
export default class extends Vue {
  @Getter("authHeader", { namespace: "user" }) authHeader!: string;
  shoppingLists: ShoppingList[] = [];
  dialogShoppingList: ShoppingList | null = null;
  dialogShoppingListItem: ShoppingListItem | null = null;
  dialogShoppingListConvert: ShoppingList | null = null;

  dialogVisible: boolean = false;
  dialogVisibleItem: boolean = false;
  dialogVisibleConvert: boolean = false;

  snackbarVisible: boolean = false;
  snackbarMessage: string = "";
  formType: FormType = FormType.Edit;

  options = [
    {
      label: "Convert to purchases",
      action: (id: number, list: any) => {
        this.showConvertDialog(list);
        console.log(list);
      }
    },
    {
      label: "Delete",
      action: (id: number) => {
        this.delete(id);
      }
    }
  ];

  optionsItem = [
    {
      label: "Delete item",
      action: (id: number) => {
        this.deleteItem(id);
      }
    }
  ];

  showConvertDialog(list: any) {
    this.dialogShoppingListConvert = list;
    this.dialogVisibleConvert = true;
  }

  fetchShoppingLists() {
    axios
      .get("shopping-lists", { headers: { Authorization: this.authHeader } })
      .then((response: AxiosResponse) => {
        this.shoppingLists = response.data;
      });
  }

  edit(shoppingList: ShoppingList) {
    this.formType = FormType.Edit;
    this.dialogShoppingList = { ...shoppingList };
    this.dialogVisible = true;
  }

  editItem(shoppingListItem: ShoppingListItem) {
    this.formType = FormType.Edit;
    this.dialogShoppingListItem = { ...shoppingListItem };
    this.dialogVisibleItem = true;
  }

  create() {
    this.formType = FormType.Create;
    this.dialogShoppingList = {
      name: ""
    };
    this.dialogVisible = true;
  }

  createItem(shoppingList: ShoppingList) {
    this.formType = FormType.Create;
    this.dialogShoppingListItem = {
      name: "",
      quantity: 0,
      shoppingListId: shoppingList.id
    };
    this.dialogVisibleItem = true;
  }

  submit(shoppingList: ShoppingList) {
    delete shoppingList.shop;
    delete shoppingList.user;
    switch (this.formType) {
      case FormType.Create:
        axios
          .post("shopping-lists", shoppingList, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchShoppingLists();
            this.showSnackbar("Shopping list created!");
          })
          .catch(err => {
            console.log(err.response.data);
            this.showSnackbar("Server error!");
          });
        break;
      case FormType.Edit: {
        axios
          .put(`shopping-lists/${shoppingList.id}`, shoppingList, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisible = false;
            this.fetchShoppingLists();
            this.showSnackbar("Shopping list updated!");
          })
          .catch(err => {
            console.log(err.response.data);
            this.showSnackbar("Server error!");
          });
        break;
      }
    }
  }

  convert({
    purchases,
    shoppingList
  }: {
    purchases: Purchase[];
    shoppingList: ShoppingList;
  }) {
    if (purchases.some(p => p.price == 0)) {
      this.showSnackbar("Price cannot be set to zero!");
      return;
    }
    axios
      .post(
        `shopping-lists/${shoppingList.id}/to-purchases`,
        { purchases },
        {
          headers: { Authorization: this.authHeader }
        }
      )
      .then((response: AxiosResponse) => {
        this.dialogVisibleConvert = false;
        this.fetchShoppingLists();
        this.showSnackbar("Shopping list converted to purchases!");
      })
      .catch(err => {
        console.log(err.response.data);
        this.showSnackbar("Server error!");
      });
  }

  submitItem(shoppingListItem: ShoppingListItem) {
    switch (this.formType) {
      case FormType.Create:
        axios
          .post("shopping-list-items", shoppingListItem, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisibleItem = false;
            this.fetchShoppingLists();
            this.showSnackbar("Item created!");
          })
          .catch(err => {
            console.log(err.response.data);
            this.showSnackbar("Server error!");
          });
        break;
      case FormType.Edit: {
        axios
          .put(`shopping-list-items/${shoppingListItem.id}`, shoppingListItem, {
            headers: { Authorization: this.authHeader }
          })
          .then((response: AxiosResponse) => {
            this.dialogVisibleItem = false;
            this.fetchShoppingLists();
            this.showSnackbar("Item updated!");
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
      .delete(`shopping-lists/${id}`, {
        headers: { Authorization: this.authHeader }
      })
      .then((response: AxiosResponse) => {
        this.showSnackbar("Shopping list deleted.");
        this.fetchShoppingLists();
      })
      .catch(error => {
        if (error.response.status == 406) {
          this.showSnackbar(
            "Cannot delete shopping list! Other items depend on it."
          );
        }
      });
  }

  deleteItem(id: number) {
    axios
      .delete(`shopping-list-items/${id}`, {
        headers: { Authorization: this.authHeader }
      })
      .then((response: AxiosResponse) => {
        this.showSnackbar("Item deleted.");
        this.fetchShoppingLists();
      });
  }

  mounted() {
    this.fetchShoppingLists();
  }

  showSnackbar(message: string) {
    this.snackbarMessage = message;
    this.snackbarVisible = true;
  }
}
</script>
