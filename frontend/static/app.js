const API_URL = "http://127.0.0.1:8000"; 
// Sau này deploy thì chỉ cần đổi thành: https://api.benhvienthaibinh.vn

async function predict() {
  const fields = ["age","sex","cp","trestbps","chol","fbs","restecg","thalach","exang","oldpeak","slope","ca","thal"];
  const data = {};
  let valid = true;

  fields.forEach(f => {
    const el = document.getElementById(f);
    if (!el.value || el.value === "") {
      el.style.borderColor = "#e74c3c";
      valid = false;
    } else {
      el.style.borderColor = "#ddd";
      data[f] = parseFloat(el.value);
    }
  });

  if (!valid) {
    alert("Vui lòng nhập đầy đủ tất cả các trường!");
    return;
  }

  const model = document.getElementById("model").value;
  const resultDiv = document.getElementById("result");
  const btnText = document.querySelector(".btn-text");
  const loading = document.querySelector(".loading");

  btnText.style.display = "none";
  loading.style.display = "inline-block";
  result.className = "result-hidden";
  result.innerHTML = "";

  try {
    const response = await fetch(`${API_URL}/predict/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();
    const prob = (json.probability * 100).toFixed(1);

    if (json.label === 1) {
      result.innerHTML = `
        <div style="font-size:52px; color:#c62828;">CẢNH BÁO NGUY CƠ CAO!</div>
        <div style="font-size:72px; font-weight:bold; color:#e74c3c; margin:25px 0;">
          ${prob}%
        </div>
        <div style="font-size:34px; font-weight:bold;">
          BỆNH NHÂN CÓ NGUY CƠ MẮC BỆNH TIM
        </div>
        <div style="margin-top:25px; font-size:24px; color:#721c24; line-height:1.6;">
          Khuyên đi khám tim mạch NGAY LẬP TỨC<br>
          Liên hệ: Bệnh viện Đa khoa tỉnh Thái Bình<br>
          Hotline: 02273.833.115
        </div>
      `;
      result.className = "result danger";
    } else {
      result.innerHTML = `...`; 
      result.className = "result safe";
    }

  } catch (error) {
    console.error(error);
    result.innerHTML = `
      <div style="color:#e74c3c; font-size:28px;">
        KHÔNG KẾT NỐI ĐƯỢC VỚI MÁY CHỦ AI<br><br>
        Lỗi: ${error.message}<br><br>
        Hãy đảm bảo backend đang chạy trên cổng 8000
      </div>`;
    result.className = "result danger";
  } finally {
    btnText.style.display = "inline-block";
    loading.style.display = "none";
  }
}