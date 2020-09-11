<template>
  <div id="layout">
    <router-view></router-view>
    <c-menu id="menu" mode="vertical" theme="dark" :collapsed="collapsed" active-name="1">
      <c-menu-item name="1">
        <c-icon-data-trend />
        PVUV
      </c-menu-item>     
      <c-menu-item name="2" disabled>
        <c-icon-more />
        其他
      </c-menu-item>
    </c-menu>
  </div>
</template>


<script>

export default {
  name: "Layout",
  data() {
    return {
      collapsed: true
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
  #layout {
    display: flex;
    flex: auto;
    flex-direction: column;
    width: 100%;
    background: #fafafa;
  }
  
  #menu {
    height:100vh;
    position: fixed;
    top:0%;
  }
 
</style>