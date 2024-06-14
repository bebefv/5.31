<template>
    <div>
        <!-- 表单 -->
        <form @submit.prevent="handleSubmit">
            商品ID:<input v-model="form.id" type="text" name="id" />
            商品名称:<input v-model="form.goods_name" type="text" name="goods_name" />
            商品类型:<input v-model="form.type" type="text" name="type" />
            商品价格:<input v-model="form.price" type="text" name="price" />
            商品库存:<input v-model="form.stock" type="text" name="stock" />
            商品销量:<input v-model="form.sold" type="text" name="sold" />
            商品状态:<input v-model="form.status" type="text" name="status" />
            排序:<input v-model="form.sort" type="text" name="sort" />
            商品图片:<input type="file" @change="handleFileUpload" />
            <input type="submit" value="提交" />
        </form>

        <!-- 搜索按钮 -->
        <button @click="searchGoods">搜索</button>
        <br /><br />

        <!-- 商品列表 -->
        <table border="1">
            <thead>
                <tr align="center">
                    <th style="width: 100px;">商品ID</th>
                    <th style="width: 100px;">商品名称</th>
                    <th style="width: 100px;">商品类型</th>
                    <th style="width: 100px;">商品价格</th>
                    <th style="width: 100px;">商品库存</th>
                    <th style="width: 100px;">商品销量</th>
                    <th style="width: 100px;">商品状态</th>
                    <th style="width: 100px;">商品描述</th>
                    <th style="width: 100px;">商品图片</th>
                    <th style="width: 100px;">创建时间</th>
                    <th style="width: 100px;">更新时间</th>
                    <th style="width: 100px;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in goods" :key="item.id" align="center">
                    <td>{{ item.id }}</td>
                    <td v-if="item.id !== editingItemId">{{ item.goods_name }}</td>
                    <td v-if="item.id === editingItemId">
                        <input v-model="editedItem.goods_name" type="text" />
                    </td>
                    <td v-if="item.id !== editingItemId">{{ item.type }}</td>
                    <td v-if="item.id === editingItemId">
                        <input v-model="editedItem.type" type="text" />
                    </td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.stock }}</td>
                    <td>{{ item.sold }}</td>
                    <td>{{ item.status }}</td>
                    <td v-if="item.id !== editingItemId">{{ item.description }}</td>
                    <td v-if="item.id === editingItemId">
                        <textarea v-model="editedItem.description"></textarea>
                    </td>
                    <td>
                        <img :src="item.img" alt="商品图片" style="max-width: 100px; max-height: 100px;" />
                    </td>
                    <td>{{ formatDate(item.created_at) }}</td>
                    <td>{{ formatDate(item.updated_at) }}</td>
                    <td>
                        <template v-if="item.id !== editingItemId">
                            <button @click="editItem(item)">编辑</button>
                        </template>
                        <template v-if="item.id === editingItemId">
                            <button @click="saveItem(item)">保存</button>
                            <button @click="cancelEdit">取消</button>
                        </template>
                        <button @click="deleteItem(item.id)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- 分页 -->
        <div>
            <button @click="prevPage" :disabled="page === 1">上一页</button>
            <button @click="nextPage">下一页</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            form: {
                id: '',
                goods_name: '',
                type: '',
                price: '',
                stock: '',
                sold: '',
                status: '',
                sort: '',
                description: '',
                img: null
            },
            goods: [],
            editingItemId: null,
            editedItem: {
                goods_name: '',
                type: '',
                price: '',
                stock: '',
                sold: '',
                status: '',
                sort: '',
                description: '',
                img: null
            },
            page: 1,
            limit: 10
        };
    },
    created() {
        this.fetchGoods();
        setInterval(this.fetchGoods, 60000); // 每隔60秒刷新商品列表
    },
    methods: {
        // 获取商品列表
        fetchGoods() {
            axios.get('https://liu.zzgoodqc.cn/goodsx/listByPage', {
                params: {
                    page: this.page,
                    limit: this.limit,
                    ...this.form
                }
            })
                .then(response => {
                    this.goods = response.data.data;
                })
                .catch(error => {
                    console.error('获取商品列表出错:', error);
                });
        },
        // 提交表单（添加或编辑商品）
        handleSubmit() {
            if (this.editingItemId !== null) {
                this.saveItem();
            } else {
                this.addGoods();
            }
        },
        // 添加商品
        addGoods() {
            let formData = new FormData();
            for (const key in this.form) {
                formData.append(key, this.form[key]);
            }

            axios.post('https://liu.zzgoodqc.cn/goodsx/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    console.log('商品添加成功:', response.data);
                    this.fetchGoods(); // 添加成功后刷新列表
                    this.clearForm(); // 清空表单数据
                })
                .catch(error => {
                    console.error('商品添加失败:', error);
                });
        },
        // 编辑商品
        editItem(item) {
            this.editingItemId = item.id;
            this.editedItem = { ...item };
        },
        // 保存编辑后的商品
        saveItem() {
            let formData = new FormData();
            for (const key in this.editedItem) {
                formData.append(key, this.editedItem[key]);
            }

            axios.put(`https://liu.zzgoodqc.cn/goodsx/update/${this.editingItemId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    console.log('商品更新成功:', response.data);
                    this.fetchGoods(); // 更新成功后刷新列表
                    this.cancelEdit(); // 取消编辑状态
                })
                .catch(error => {
                    console.error('商品更新失败:', error);
                });
        },
        // 取消编辑
        cancelEdit() {
            this.editingItemId = null;
            this.editedItem = {
                goods_name: '',
                type: '',
                price: '',
                stock: '',
                sold: '',
                status: '',
                sort: '',
                description: '',
                img: null
            };
        },
        // 删除商品
        deleteItem(id) {
            axios.get(`https://liu.zzgoodqc.cn/goodsx/delete?id=${id}`)
                .then(() => {
                    this.list = this.list.filter(item => item.id !== id);
                })
                .catch((error) => {
                    console.error("删除报错!", error);;
                });
        },
        // 格式化日期
        formatDate(dateStr) {
            const date = new Date(dateStr);
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        },
        // 清空表单
        clearForm() {
            this.form = {
                id: '',
                goods_name: '',
                type: '',
                price: '',
                stock: '',
                sold: '',
                status: '',
                sort: '',
                description: '',
                img: null
            };
        },
        // 处理文件上传
        handleFileUpload(event) {
            if (this.editingItemId !== null) {
                this.editedItem.img = event.target.files[0];
            } else {
                this.form.img = event.target.files[0];
            }
        },
        // 搜索商品
        searchGoods() {
            this.page = 1;
            this.fetchGoods();
        },
        // 上一页
        prevPage() {
            if (this.page > 1) {
                this.page--;
                this.fetchGoods();
            }
        },
        // 下一页
        nextPage() {
            this.page++;
            this.fetchGoods();
        }
    }
};
</script>

<style scoped></style>
