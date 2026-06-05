<template>
  <div class="container">
    <h1>Tra cứu điểm</h1>
    
    <form @submit.prevent="handleSearch" id="search-form">
        <div class="form-group">
            <label for="sbd">Số Báo Danh</label>
            <input 
              type="text" 
              id="sbd" 
              v-model="sbd" 
              placeholder="Nhập số báo danh (VD: 560403)" 
              required 
              autocomplete="off"
            >
        </div>
        
        <button type="submit" :disabled="loading">
            <span v-if="!loading">Tra Cứu</span>
            <div v-else class="loading-spinner"></div>
        </button>
    </form>

    <div v-if="errorMsg" class="error-message">
      {{ errorMsg }}
    </div>

    <div v-if="result" id="result-container">
      <h3 class="result-title">Kết quả thi:</h3>
      <div v-for="(value, key) in formattedResult" :key="key" class="result-item">
          <span class="result-label">{{ key }}</span>
          <span class="result-value">{{ value !== null ? value : '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const sbd = ref('');
const loading = ref(false);
const errorMsg = ref('');
const result = ref(null);

const handleSearch = async () => {
  if (!sbd.value.trim()) return;

  errorMsg.value = '';
  result.value = null;
  loading.value = true;

  try {
    const response = await axios.post('/api/search', {
      so_bao_danh: sbd.value.trim()
    });

    const data = response.data;
    
    if (data && Object.keys(data).length > 0 && !data.error) {
      const itemObj = data.data || data;
      const resultData = Array.isArray(itemObj) ? itemObj[0] : itemObj;
      
      if (!resultData) {
        errorMsg.value = 'Không tìm thấy kết quả cho số báo danh này.';
      } else {
        result.value = resultData;
      }
    } else {
      errorMsg.value = 'Không tìm thấy kết quả cho số báo danh này.';
    }
  } catch (error) {
    console.error(error);
    errorMsg.value = 'Có lỗi xảy ra hoặc hệ thống đang bảo trì. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
  }
};

const formattedResult = computed(() => {
  if (!result.value) return {};
  
  const keysToIgnore = ['id', 'created_at', 'updated_at'];
  const formatted = {};
  
  for (const [key, value] of Object.entries(result.value)) {
    if (keysToIgnore.includes(key.toLowerCase())) continue;
    
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    formatted[formattedKey] = value;
  }
  
  return formatted;
});
</script>

<style scoped>
.container {
    background: var(--surface, #1E293B);
    padding: 2.5rem;
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 480px;
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.875rem;
    font-weight: 700;
    background: linear-gradient(135deg, #818CF8, #C084FC);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-muted, #94A3B8);
    font-size: 0.875rem;
}

input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid #334155;
    border-radius: 0.5rem;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

input:focus {
    outline: none;
    border-color: var(--primary, #4F46E5);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
}

button {
    width: 100%;
    padding: 0.875rem;
    background: var(--primary, #4F46E5);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50px;
}

button:hover:not(:disabled) {
    background: var(--primary-hover, #4338CA);
}

button:active:not(:disabled) {
    transform: scale(0.98);
}

button:disabled {
    background: #475569;
    cursor: not-allowed;
}

.loading-spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

#result-container {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #334155;
    animation: fadeIn 0.3s ease-out;
}

.result-title {
    margin-bottom: 1rem;
    color: #818CF8;
    font-size: 1.25rem;
}

.result-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(51, 65, 85, 0.5);
}

.result-item:last-child {
    border-bottom: none;
}

.result-label {
    color: var(--text-muted, #94A3B8);
    font-size: 0.875rem;
}

.result-value {
    font-weight: 600;
}

.error-message {
    color: var(--error, #EF4444);
    text-align: center;
    margin-top: 1rem;
    font-size: 0.875rem;
    animation: fadeIn 0.3s ease-out;
}
</style>
