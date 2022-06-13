<script setup lang="ts">
export interface TableRow {
  id: number,
  col1: string,
  col2?: string,
  col3?: string,
  col4?: string,
  col5?: string,
  actions?: {
    icon?: string,
    label: string,
    link?: string,
    action?: () => void
  }[]
}

interface Props {
  rows: TableRow[],
  columns: string[],
  showIdColumn?: boolean,
  showActionsColumn?: boolean,
}

withDefaults(defineProps<Props>(), {
  rows: () => [],
  columns: () => [],
  showIdColumn: false,
  showActionsColumn: false
})
</script>

<template>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th v-if="showIdColumn" scope="col" class="px-6 py-3">ID</th>
          <th v-for="column in columns" :key="`column-${column}`" scope="col" class="px-6 py-3">
            {{ column }}
          </th>
          <th v-if="showActionsColumn" scope="col" class="px-6 py-3">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="`row-${row.id}`" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td v-if="showIdColumn" class="px-6 py-4">
            {{ row.id }}
          </td>
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
            {{ row.col1 }}
          </th>
          <td v-if="row.col2" class="px-6 py-4">
            {{ row.col2 }}
          </td>
          <td v-if="row.col3" class="px-6 py-4">
            {{ row.col3 }}
          </td>
          <td v-if="row.col4" class="px-6 py-4">
            {{ row.col4 }}
          </td>
          <td v-if="row.col5" class="px-6 py-4">
            {{ row.col5 }}
          </td>
          <td v-if="showActionsColumn" class="px-6 py-4">
            <!-- eslint-disable-next-line vue/no-v-for-template-key -->
            <template v-for="action in row.actions" :key="`action-${action.label}`">
              <nuxt-link
                v-if="action.link"
                :to="action.link"
                class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                {{ action.label }}
              </nuxt-link>

              <button
                v-if="action.action"
                class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                @click="action.action()"
              >
                {{ action.label }}
              </button>
            </template>
          </td>
        </tr>
        <tr v-if="rows.length === 0" class="bg-white dark:bg-gray-800">
          <td colspan="100" class="px-6 py-4 text-center">
            No results found
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
