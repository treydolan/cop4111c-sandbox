// layout/head.js
export function renderHead() {
  return `
    <!-- Bootstrap CSS -->
    <link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap.min.css"
      crossorigin="anonymous">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.13.1/font/bootstrap-icons.min.css"
      crossorigin="anonymous">
    
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
    <rect width='16' height='16' fill='%236c757d'/>
    <text x='8' y='12' font-size='10' text-anchor='middle' fill='white'>B</text>
    </svg>">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="main.css">
  `;
}
