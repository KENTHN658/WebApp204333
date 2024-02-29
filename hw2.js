// สร้างออบเจ็กต์สำหรับเก็บข้อมูลแบบฟอร์ม
var formDataObject = {};

// เลือกแบบฟอร์มโดยใช้ ID
var form = document.getElementById("form2");

// กำหนด URL ของเว็บเซอร์วิสที่ใช้งาน
const endpoint = "https://glowing-dog-97.hasura.app/api/rest/Message";

// กำหนดส่วนหัวของ HTTP request
const headers = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret":
    "gLxuzKJM2xWCpZAueahGQAlPcapxCYhpblc756Q15nbVCpo2CaqNGdkiLdZY6LJ4",
};

// เมื่อ DOM โหลดเสร็จสมบูรณ์
document.addEventListener("DOMContentLoaded", function () {
  handleFormSubmission();
  loadMessagesAndUpdateCache();
});

// ฟังก์ชันสำหรับจัดการการส่งข้อมูลแบบฟอร์ม
function handleFormSubmission() {
  var inputElement = document.querySelector(".input1");

  // เพิ่ม event listener เมื่อมีการกดปุ่ม Enter ใน input field
  inputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      collectFormData();
    }
  });
}

// ฟังก์ชันสำหรับรวบรวมข้อมูลจากแบบฟอร์ม
function collectFormData() {
  var formData = new FormData(form);
  formData.forEach(function (value, key) {
    formDataObject[key] = value;
  });

  clearInputField();
  insertText();
  insertData();
}

// ฟังก์ชันสำหรับเคลียร์ input field
function clearInputField() {
  var inputElement = document.querySelector(".input1");
  inputElement.value = "";
}

// ฟังก์ชันสำหรับแสดงข้อความใหม่ใน UI
function insertText() {
  let maxMessages = 5; // จำนวนข้อความสูงสุดที่แสดง
  let messageContainer = document.querySelector("#box-message");
  let messageOutput = `
    <div class="Container4">
      <div id="uname">${formDataObject.user}</div>
      <div id="message">${formDataObject.message}</div>
    </div>
  `;
  messageContainer.insertAdjacentHTML("afterbegin", messageOutput);
  hideOldMessagesIfNeeded();
}

// ฟังก์ชันสำหรับซ่อนข้อความที่เก่าเกินกำหนด
function hideOldMessagesIfNeeded() {
  let maxMessages = 5;
  let messages = document.getElementsByClassName("Container4");
  if (messages.length > maxMessages) {
    for (let i = maxMessages; i < messages.length; i++) {
      messages[i].style.display = "none";
    }
  }
}

// ฟังก์ชันสำหรับส่งข้อมูลไปยังเซิร์ฟเวอร์
function insertData() {
  var data = {
    uname: formDataObject.user,
    message: formDataObject.message,
  };

  fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      loadMessagesAndUpdateCache();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// ฟังก์ชันสำหรับโหลดข้อมูลและอัปเดต cache
function loadMessagesAndUpdateCache() {
  fetchMessagesFromAPI()
    .then((data) => {
      cacheMessagesLocally(data);
      renderMessages(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// ฟังก์ชันสำหรับโหลดข้อมูลจากเซิร์ฟเวอร์
function fetchMessagesFromAPI() {
  return fetch("https://glowing-dog-97.hasura.app/api/rest/myquery")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// ฟังก์ชันสำหรับเก็บข้อมูลลงใน cache
function cacheMessagesLocally(data) {
  localStorage.setItem("cachedMessages", JSON.stringify(data));
  console.log(localStorage)
}

// ฟังก์ชันสำหรับแสดงข้อมูลใน UI
function renderMessages(data) {
  const messageContainer = document.getElementById("box-message");
  messageContainer.innerHTML = "";

  data.Message.forEach((message) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = "Container4";

    const unameDiv = document.createElement("div");
    unameDiv.id = "uname";
    unameDiv.textContent = message.uname;

    const messageContentDiv = document.createElement("div");
    messageContentDiv.id = "message";
    messageContentDiv.textContent = message.message;

    messageDiv.appendChild(unameDiv);
    messageDiv.appendChild(messageContentDiv);

    messageContainer.appendChild(messageDiv);
  });
}
