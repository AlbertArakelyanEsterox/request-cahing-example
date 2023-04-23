import { request, resetCache } from '../utils/index.js';
import { transformApiData } from '../helpers/index.js';

class DataTable {
  constructor({
    rows = [],
    dataSource = null,
    perPage = 5,
    totalPages = 0,
  }) {
    this.rows = rows;
    this.dataSource = dataSource;
    this.perPage = perPage;
    this.totalPages = totalPages;
    this.activePage = 0;
  }

  init($tableContainer) {
    this.$tableContainer = $tableContainer;

    this.$table = document.createElement('table');
    this.$table.classList.add('table', 'table-hover', 'table-primary');

    $tableContainer.appendChild(this.$table);

    this.createMainParts();

    this.addResetCacheButton();
  }

  createMainParts() {
    this.$thead = document.createElement('thead');
    this.renderHead();

    this.$tbody = document.createElement('tbody');
    this.renderData();

    this.$table.append(this.$thead, this.$tbody);

    this.createPagination();
  }

  renderHead() {
    this.$thead.innerHTML = `
      <tr>
        ${this.rows.map((row) => {
          return `
            <th data-index="${row.dataIndex}">${row.value}</th>
          `;
        }).join('')}
      </tr>
    `;
  }

  renderData(dataSource = this.dataSource) {
    // This change $this.tbody everytime based on new dataSource
    this.$tbody.innerHTML = `
      ${this.dataSource.map((dataItem) => {
        return `
          <tr>
            ${Object.entries(dataItem).map(([key, value], index) => {
              return `
                <td>${value}</td>
              `;
            }).join('')}
          </tr>
        `;
      }).join('')}
    `;
  }

  createPagination() {
    this.$pagination = document.createElement('nav');

    this.renderPagination();

    this.$tableContainer.appendChild(this.$pagination);

    this.addPaginationListeners();
  }

  renderPagination() {
    const paginationArr = [];

    for (let i = 1; i <= this.totalPages; i++) {
      paginationArr.push(i);
    }

    this.$pagination.innerHTML = `
      <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#">Previous</a></li>
        ${paginationArr.map((paginationItem) => {
          return `
            <li class="page-item ${this.activePage == paginationItem ? 'active': ''}" data-page=${paginationItem}>
              <a class="page-link" href="#" data-page=${paginationItem}>${paginationItem}</a>
            </li>
          `;
        }).join('')}
        <li class="page-item"><a class="page-link" href="#">Next</a></li>
      </ul>
    `;

  }

  addPaginationListeners() {
    this.$paginationLinks = this.$tableContainer.querySelectorAll('.page-link');
    
    this.$paginationLinks.forEach(($paginationItem) => {
      $paginationItem.addEventListener('click', this.onPageChange.bind(this));
    });
  }

  onPageChange(e) {
    e.preventDefault();

    const { page } = e.target.dataset;
    this.activePage = page;

    request(`https://api.datacite.org/dois?query=created:[2010-01-01%20TO%202012-01-01]&page[number]=${page}&page[size]=5`)
      .then((res) => {
        const data = transformApiData(res.data);

        this.dataSource = data;

        this.renderData();
        this.setActivePage();
      });
  }

  setActivePage(page = this.activePage) {
    if (!page) {
      throw new Error('page should be passed!');
    }

    this.$paginationLinks.forEach(($paginationLink) => {
      if ($paginationLink.dataset.page === this.activePage) {
        if (!$paginationLink.parentElement.classList.contains('active')) {
          $paginationLink.parentElement.classList.add('active');
        }
      } else {
        if ($paginationLink.parentElement.classList.contains('active')) {
          $paginationLink.parentElement.classList.remove('active');
        }
      }
    });
  }

  addResetCacheButton() {
    const $resetCacheButton = document.createElement('button');
    $resetCacheButton.classList.add('btn', 'btn-danger', 'mt-2');
    $resetCacheButton.innerHTML = 'Reset cache';

    $resetCacheButton.addEventListener('click', () => {
      resetCache('my-cache');
    });
    
    this.$tableContainer.appendChild($resetCacheButton)
  }
}


Element.prototype.datatable = function({
  rows,
  dataSource,
  perPage,
  totalPages,
}) {
  const dataTable = new DataTable({
    rows,
    dataSource,
    perPage,
    totalPages,
  });

  if (this.children.length || this.tagName !== 'DIV') {
    throw new Error('For creating a datatable you need an empty <div> container');
  }

  dataTable.init(this);
}