<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:20%;min-width:100px;">
		<el-form-item label="账号">
			<el-input v-model="form.name"></el-input>
		</el-form-item	>
		<el-form-item label="旧密码">
			<el-input v-model="form.name"></el-input>

		</el-form-item	>
				<el-form-item label="新密码">
			<el-input v-model="form.name"></el-input>
		</el-form-item	>

		<el-form-item>
			<el-button type="primary">立即修改</el-button>
			<el-button @click.native.prevent>取消</el-button>
		</el-form-item>
		
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					oldPassword:'',
					newPassword: '',
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			}
		}
	}

</script>