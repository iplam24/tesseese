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
    background: var(--surface);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    padding: 3rem 2.5rem;
    border-radius: 1.5rem;
    border: 1px solid var(--glass-border);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.1) inset;
    width: 100%;
    max-width: 460px;
    animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
    from { opacity: 0; transform: translateY(40px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

h1 {
    text-align: center;
    margin-bottom: 2.5rem;
    font-size: 2.25rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    background: linear-gradient(to right, #a855f7, #6366f1, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
}

.form-group {
    margin-bottom: 1.75rem;
}

label {
    display: block;
    margin-bottom: 0.75rem;
    color: var(--text-muted);
    font-size: 0.95rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

input {
    width: 100%;
    padding: 1rem 1.25rem;
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    color: white;
    font-size: 1.1rem;
    font-family: inherit;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

input:focus {
    outline: none;
    background: rgba(15, 23, 42, 0.8);
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15), 0 0 20px rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
}

button {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, var(--primary), #8b5cf6);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: 0.025em;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 56px;
    box-shadow: 0 10px 20px -10px rgba(99, 102, 241, 0.5);
}

button:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 25px -10px rgba(99, 102, 241, 0.6);
    filter: brightness(1.1);
}

button:active:not(:disabled) {
    transform: translateY(0);
}

button:disabled {
    background: #334155;
    color: #94a3b8;
    box-shadow: none;
    cursor: not-allowed;
}

.loading-spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 3px solid rgba(255,255,255,0.2);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

#result-container {
    margin-top: 2.5rem;
    padding-top: 2rem;
    border-top: 1px dashed rgba(255, 255, 255, 0.1);
    animation: slideUpFade 0.4s ease-out;
}

.result-title {
    margin-bottom: 1.25rem;
    font-size: 1.3rem;
    font-weight: 600;
    color: #a855f7;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: background-color 0.2s ease, padding-left 0.2s ease;
}

.result-item:hover {
    background-color: rgba(255, 255, 255, 0.02);
    padding-left: 0.5rem;
    border-radius: 0.5rem;
    border-bottom-color: transparent;
}

.result-item:last-child {
    border-bottom: none;
}

.result-label {
    color: var(--text-muted);
    font-size: 0.95rem;
    font-weight: 400;
}

.result-value {
    font-weight: 700;
    font-size: 1.1rem;
    color: #e2e8f0;
    background: rgba(255,255,255,0.05);
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
}

.error-message {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    color: var(--error);
    text-align: center;
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 0.75rem;
    font-size: 0.95rem;
    font-weight: 600;
    animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
