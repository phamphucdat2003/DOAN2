const arrClass = [
    {
        name:"Công Nghệ Thông Tin"
    },
    {
        name:"Khoa Học Dữ liệu"
    },
    {
        name:"Khoa Học Máy Tính"
    },
    {
        name:"Kỹ Thuật Phần Mềm"
    },
    {
        name:"Hệ Thống Thông Tin"
    },
];


arrClass.forEach((classUser) => {
    fetch("http://localhost:3000/admin/addclass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classUser),
    });
  });