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
  // เลือกแบบฟอร์มและอิงอาร์เรย์ของอิลิเมนต์ input
  var form = document.getElementById("form2");
  var inputElement = document.querySelector(".input1");

  // เพิ่ม event listener เมื่อมีการกดปุ่ม Enter ใน input field
  inputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();

      // เก็บข้อมูลจากแบบฟอร์มลงในตัวแปร formDataObject
      var formData = new FormData(form);
      formData.forEach(function (value, key) {
        formDataObject[key] = value;
      });

      // เคลียร์ input field
      inputElement.value = "";

      // แสดงข้อความใหม่ใน UI
      insertText();

      // เรียกฟังก์ชัน insert() เพื่อเพิ่มข้อมูลลงในฐานข้อมูล
      insertData();
    }
  });

  // โหลดข้อมูลแสดงใน UI เมื่อเว็บโหลดเสร็จสมบูรณ์
  loadMessagesAndUpdateCache();
});

// ฟังก์ชันสำหรับแสดงข้อความใหม่ใน UI
function insertText() {
  let maxMessages = 5; // จำนวนข้อความสูงสุดที่แสดง

  // เลือก element ที่ต้องการแสดงข้อความ
  let messageContainer = document.querySelector("#box-message");

  // สร้าง HTML element ใหม่สำหรับข้อความ
  let messageOutput = `
    <div class="Container4">
      <div id="uname">${formDataObject.user}</div>
      <div id="message">${formDataObject.message}</div>
    </div>
  `;

  // แทรก HTML element ใหม่ลงใน container
  messageContainer.insertAdjacentHTML("afterbegin", messageOutput);

  // ซ่อนข้อความเก่าเมื่อเกินจำนวนสูงสุดที่กำหนดไว้
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
      // เรียกฟังก์ชันเพื่อโหลดข้อมูลและอัปเดต cache
      loadMessagesAndUpdateCache();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// ฟังก์ชันสำหรับโหลดข้อมูลและอัปเดต cache
function loadMessagesAndUpdateCache() {
  fetch("https://glowing-dog-97.hasura.app/api/rest/myquery")
    .then((response) => response.json())
    .then((data) => {
      // เก็บข้อมูลใน cache
      localStorage.setItem("cachedMessages", JSON.stringify(data));
      // แสดงข้อมูลใน UI
      renderMessages(data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
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

// ฟังก์ชันสำหรับโหลดข้อมูลเพิ่มเติม
function loadMoreMessages() {
  // แสดงข้อความที่ซ่อนไว้
  let messages = document.getElementsByClassName("Container4");
  for (let i = 0; i < messages.length; i++) {
    messages[i].style.display = "flex";
  }
}