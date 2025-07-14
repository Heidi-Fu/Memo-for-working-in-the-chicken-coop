
        // 工作记录数据存储
        let workRecords = [];
        let currentEditIndex = -1;

        // DOM 元素
        const workRecordForm = document.getElementById('workRecordForm');
        const animalNameInput = document.getElementById('animalName');
        const taskTypeInput = document.getElementById('taskType');
        const descriptionInput = document.getElementById('description');
        const statusInput = document.getElementById('status');
        const dateInput = document.getElementById('date');
        const addBtn = document.getElementById('addBtn');
        const resetBtn = document.getElementById('resetBtn');
        const workRecordList = document.getElementById('workRecordList');
        const animalNameError = document.getElementById('animalNameError');
        const taskTypeError = document.getElementById('taskTypeError');
        const dateError = document.getElementById('dateError');
        const statusFilter = document.getElementById('statusFilter');

        // 设置默认日期为今天
        document.addEventListener('DOMContentLoaded', () => {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
            
            // 从 localStorage 获取数据
            const savedRecords = localStorage.getItem('workRecords');
            if (savedRecords) {
                workRecords = JSON.parse(savedRecords);
                renderWorkRecordList();
            }
            
            // 添加筛选事件监听
            statusFilter.addEventListener('change', renderWorkRecordList);
        });

        // 渲染工作记录列表
        function renderWorkRecordList() {
            workRecordList.innerHTML = '';
            
            // 筛选记录
            let filteredRecords = workRecords;
            const filterValue = statusFilter.value;
            if (filterValue !== 'all') {
                filteredRecords = workRecords.filter(record => record.status === filterValue);
            }
            
            if (filteredRecords.length === 0) {
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = `<td colspan="5" style="text-align: center;">暂无工作记录</td>`;
                workRecordList.appendChild(emptyRow);
                return;
            }
            
            filteredRecords.forEach((record, index) => {
                const row = document.createElement('tr');
                const statusClass = record.status === 'pending' ? 'status-pending' : 'status-completed';
                const statusText = record.status === 'pending' ? '待处理' : '已完成';
                
                row.innerHTML = `
                    <td>${record.animalName}</td>
                    <td>${record.taskType}</td>
                    <td>${record.date}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn-warning" onclick="editRecord(${index})">编辑</button>
                        <button class="btn-danger" onclick="deleteRecord(${index})">删除</button>
                    </td>
                `;
                workRecordList.appendChild(row);
            });
            
            // 保存到 localStorage
            localStorage.setItem('workRecords', JSON.stringify(workRecords));
        }

        // 添加/编辑工作记录
        workRecordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 验证
            let isValid = true;
            
            if (!animalNameInput.value.trim()) {
                animalNameError.textContent = '动物名称不能为空';
                isValid = false;
            } else {
                animalNameError.textContent = '';
            }
            
            if (!taskTypeInput.value) {
                taskTypeError.textContent = '请选择任务类型';
                isValid = false;
            } else {
                taskTypeError.textContent = '';
            }
            
            if (!dateInput.value) {
                dateError.textContent = '请选择日期';
                isValid = false;
            } else {
                dateError.textContent = '';
            }
            
            if (!isValid) return;
            
            const record = {
                animalName: animalNameInput.value.trim(),
                taskType: taskTypeInput.value,
                description: descriptionInput.value.trim(),
                status: statusInput.value,
                date: dateInput.value
            };
            
            if (currentEditIndex === -1) {
                // 添加新记录
                workRecords.push(record);
            } else {
                // 更新现有记录
                workRecords[currentEditIndex] = record;
                addBtn.textContent = '添加记录';
                currentEditIndex = -1;
            }
            
            // 重置表单
            workRecordForm.reset();
            dateInput.value = new Date().toISOString().split('T')[0]; // 重置日期为今天
            renderWorkRecordList();
        });

        // 编辑记录
        window.editRecord = function(index) {
            const record = workRecords[index];
            animalNameInput.value = record.animalName;
            taskTypeInput.value = record.taskType;
            descriptionInput.value = record.description || '';
            statusInput.value = record.status;
            dateInput.value = record.date;
            addBtn.textContent = '保存修改';
            currentEditIndex = index;
            
            // 滚动到表单
            workRecordForm.scrollIntoView({ behavior: 'smooth' });
        };

        // 删除记录
        window.deleteRecord = function(index) {
            if (confirm('确定要删除这条工作记录吗？')) {
                workRecords.splice(index, 1);
                if (currentEditIndex === index) {
                    workRecordForm.reset();
                    dateInput.value = new Date().toISOString().split('T')[0];
                    addBtn.textContent = '添加记录';
                    currentEditIndex = -1;
                }
                renderWorkRecordList();
            }
        };

        // 重置表单
        resetBtn.addEventListener('click', () => {
            workRecordForm.reset();
            dateInput.value = new Date().toISOString().split('T')[0];
            addBtn.textContent = '添加记录';
            currentEditIndex = -1;
            animalNameError.textContent = '';
            taskTypeError.textContent = '';
            dateError.textContent = '';
        });
