//const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://heart-api-thaibinh.onrender.com";

const MODEL_ENDPOINTS = {
  xgb: "/predict/xgb",
  svm: "/predict/svm",
  mlp: "/predict/mlp",
  rf: "/predict/rf"
};

const MODEL_NAMES = {
  xgb: "XGBoost",
  svm: "Support Vector Machine (SVM)",
  mlp: "Mạng Nơ-ron Nhân tạo (MLP)",
  rf: "Random Forest (RF)"
};

async function predict() {
  const fields = ["age","sex","cp","trestbps","chol","fbs","restecg","thalach","exang","oldpeak","slope","ca","thal"];
  const data = {};
  let valid = true;

  fields.forEach(f => {
    const el = document.getElementById(f);
    if (!el.value || el.value === "") {
      el.style.borderColor = "#e74c3c";
      el.style.boxShadow = "0 0 12px rgba(231,76,60,0.4)";
      valid = false;
    } else {
      el.style.borderColor = "#764ba2";
      el.style.boxShadow = "none";
      data[f] = parseFloat(el.value);
    }
  });

  if (!valid) {
    showNotification("Vui lòng nhập đầy đủ tất cả các trường!", "error");
    return;
  }

  const model = document.getElementById("model").value;
  const endpoint = MODEL_ENDPOINTS[model];

  const resultDiv = document.getElementById("result");
  const btnText = document.querySelector(".btn-text");
  const loading = document.querySelector(".loading");

  btnText.style.display = "none";
  loading.style.display = "inline-block";
  resultDiv.className = "result-hidden";
  resultDiv.innerHTML = "";

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`Lỗi ${response.status}`);

    const result = await response.json();
    const probPercent = (result.probability * 100).toFixed(1);
    const isDanger = result.label === 1;
    const modelName = MODEL_NAMES[model];

    playSound(isDanger);

    if (isDanger) {
      resultDiv.innerHTML = `
        <div style="font-size:52px;color:#c62828;margin-bottom:12px;">CẢNH BÁO NGUY CƠ CAO!</div>
        <div style="font-size:26px;color:#777;margin-bottom:18px;">Dự đoán bởi: <strong>${modelName}</strong></div>
        <div style="font-size:82px;font-weight:bold;color:#e74c3c;text-shadow:0 4px 15px rgba(231,76,60,0.3);">${probPercent}%</div>
        <div style="font-size:38px;font-weight:bold;color:#721c24;margin:20px 0;">CÓ NGUY CƠ MẮC BỆNH TIM MẠCH</div>
        <div style="margin-top:30px;font-size:24px;line-height:1.8;color:#992020;">
          <strong>Khuyến cáo:</strong> Đi khám chuyên khoa Tim mạch <strong>NGAY TRONG 24-48H</strong><br><br>
          <div style="background:#ffebee;padding:22px;border-radius:18px;margin-top:20px;border-left:7px solid #e74c3c;">
            <strong>Bệnh viện Đa khoa tỉnh Thái Bình</strong><br>
            Địa chỉ: 18 Lý Thường Kiệt, TP. Thái Bình<br>
            Hotline cấp cứu: <strong style="font-size:28px;">0227 383 3115</strong>
          </div>
        </div>`;
      resultDiv.className = "result danger";
    } else {
      resultDiv.innerHTML = `
        <div style="font-size:52px;color:#1b5e20;margin-bottom:12px;">CHÚC MỪNG!</div>
        <div style="font-size:26px;color:#777;margin-bottom:18px;">Dự đoán bởi: <strong>${modelName}</strong></div>
        <div style="font-size:82px;font-weight:bold;color:#27ae60;text-shadow:0 4px 15px rgba(39,174,96,0.3);">${probPercent}%</div>
        <div style="font-size:38px;font-weight:bold;color:#1b5e20;margin:20px 0;">NGUY CƠ MẮC BỆNH TIM RẤT THẤP</div>
        <div style="margin-top:30px;font-size:24px;line-height:1.8;color:#2e7d32;">
          Tim mạch đang ở trạng thái <strong>TỐT</strong>.<br>
          Hãy duy trì lối sống lành mạnh và kiểm tra định kỳ 6-12 tháng/lần.
        </div>`;
      resultDiv.className = "result safe";
    }
    resultDiv.classList.remove("result-hidden");

  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `<div style="color:#c62828;font-size:30px;">KHÔNG KẾT NỐI ĐƯỢC VỚI HỆ THỐNG AI</div>
      <div style="margin-top:20px;font-size:20px;color:#721c24;">Kiểm tra lại URL backend hoặc liên hệ nhóm backend<br><small>Lỗi: ${error.message}</small></div>`;
    resultDiv.className = "result danger";
  } finally {
    btnText.style.display = "inline-block";
    loading.style.display = "none";
  }
}

function showNotification(msg, type = "error") {
  const n = document.createElement("div");
  n.textContent = msg;
  n.style.cssText = `position:fixed;top:20px;right:20px;z-index:10000;padding:16px 28px;border-radius:12px;color:white;font-weight:bold;
    background:${type==="error"?"#e74c3c":"#27ae60"};box-shadow:0 10px 30px rgba(0,0,0,0.3);animation:slideIn 0.4s;`;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 4500);
}

function playSound(isDanger) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(isDanger ? 880 : 640, ctx.currentTime);
  o.connect(ctx.destination);
  o.start();
  setTimeout(() => o.stop(), isDanger ? 900 : 500);
}

document.addEventListener("keypress", e => {
  if (e.key === "Enter" && document.activeElement.tagName !== "BUTTON") predict();
});