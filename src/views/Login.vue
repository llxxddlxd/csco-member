<template>
</template>
<script>
	import {} from '../api/api'
	export default{
		data(){
			return{

			}
		},
		methods:{

       
		},
		mounted() {
            console.log("mounted") 
            //默认登录成功
            sessionStorage.setItem('user','csco')
            this.$router.push({ path: '/indexpage' })
        },
	}
</script>