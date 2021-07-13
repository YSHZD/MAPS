import Vue from 'vue'
import store from '@/store'

Vue.directive('auth', {
  inserted: function(el, binding) {
    // v-auth:zhgd_aqgl_clgl_info_delete.btn  
    // v-auth.btn="'zhgd_aqgl_clgl_info_delete'"  
    if ((binding.arg || binding.value) 
        && !store.state[(binding.modifiers && binding.modifiers.btn)?'authButtons' : 'authIds'].includes(binding.arg || binding.value)
    ) {
      el.parentNode.removeChild(el)
    }
  }
})
