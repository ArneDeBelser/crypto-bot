<template>
    <v-navigation-drawer permanent>
        <v-list color="transparent">
            <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard">
            </v-list-item>
            <v-list-item prepend-icon="mdi-account-box" title="Account">
            </v-list-item>
            <v-list-item prepend-icon="mdi-gavel" title="Admin"> </v-list-item>
        </v-list>

        <template v-slot:append>
            <div class="pa-2">
                <v-btn block color="blue">Logout</v-btn>
            </div>
        </template>
    </v-navigation-drawer>
</template>

<script setup>
</script>
