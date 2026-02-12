// layout/footer.js
export function renderFooter() {
  const year = new Date().getFullYear();

  return `
    <div class="container py-3 text-center">
        <nav class="container py-3">
            <ul class="pagination pagination-sm justify-content-center align-content-md-end">
                <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
                </li>
                <li class="page-item"><a class="page-link" href="#">1</a></li>
                <li class="page-item active" aria-current="page"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">Next</a></li>
            </ul>
        </nav>
        <hr>
      <small class="text-secondary">&copy; ${year} Trey Dolan</small>
    </div>
  `;
};
