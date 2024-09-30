<template>
  <el-container style="height: 100vh">
    <el-header>
      <el-menu
        :default-active="activeHeader"
        mode="horizontal"
        class="header-menu"
      >
        <!-- 添加图片 -->
        <el-menu-item>
          <img src="/image/WebLogo.png" alt="Logo" class="logo" />
        </el-menu-item>
        <el-menu-item
          v-for="item in headerItems"
          :key="item.id"
          @click="handleHeaderClick(item.id)"
        >
          {{ item.name }}
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside width="250px">
        <el-menu :default-active="activeSidebar" class="sidebar-menu">
          <el-menu-item
            v-for="item in sidebarItems"
            :key="item.id"
            @click="handleSidebarClick(item.id)"
          >
            {{ item.name }}
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <NuxtPage />
      </el-main>
    </el-container>
  </el-container>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";
import { useFetch } from "nuxt/app";

const headerItems = ref([]);
const sidebarItems = ref([]);
const activeHeader = ref("1"); // 默认激活的顶部菜单项
const activeSidebar = ref("1"); // 默认激活的侧边菜单项

onMounted(async () => {
  const { data: headerData } = await useFetch("/api/header-items");
  headerItems.value = headerData.value;

  const { data: sidebarData } = await useFetch("/api/sidebar-items");
  sidebarItems.value = sidebarData.value;
});

const handleHeaderClick = (id) => {
  activeHeader.value = id;
  // 处理顶部菜单项的点击事件
};

const handleSidebarClick = (id) => {
  activeSidebar.value = id;
  // 处理侧边菜单项的点击事件
};
</script>
  
  <style scoped>
.header-menu .el-menu-item {
  font-size: 18px; /* 调整顶部菜单字体大小 */
}

.sidebar-menu .el-menu-item {
  font-size: 16px; /* 调整侧边菜单字体大小 */
}

.sidebar-menu {
  height: 100%;
  border-right: 1px solid #ebeef5;
}

.logo {
  height: 60px; /* 根据需要调整高度 */
  margin-right: 70px; /* 添加右边距 */
  margin-left: 40px; /* 添加右边距 */
}
</style>
  