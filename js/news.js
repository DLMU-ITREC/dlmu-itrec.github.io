$(document).ready(function () {
    // 配置参数
    const config = {
        pageSize: 10,    // 每页显示10条新闻
        currentPage: 1,  // 当前页码
        totalPages: 1,   // 总页数
        totalItems: 0    // 总条目数
    };

    // 修改样式部分
    // 加载新闻数据
    function loadNews(page) {
        $.ajax({
            url: '../data/news.json',
            method: 'GET',
            success: function (response) {
                // 计算总页数
                config.totalItems = response.length;
                config.totalPages = Math.ceil(config.totalItems / config.pageSize);

                // 计算当前页的数据范围
                const start = (page - 1) * config.pageSize;
                const end = start + config.pageSize;
                const pageData = response.slice(start, end);

                // 清空并更新新闻列表
                $('#newsList').empty();
                pageData.forEach(item => {
                    const newsItem = `
                        <li class="news-item">
                            <a href="${item.link || '#'}" class="text-decoration-none d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">${item.title}</h5>
                                <small class="ms-3 news-date">${item.date}</small>
                            </a>
                        </li>
                    `;
                    $('#newsList').append(newsItem);
                });

                // 更新分页信息
                updatePagination();
                updateButtonStates();
            },
            error: function (xhr, status, error) {
                console.error('Error loading news:', error);
                $('#newsList').html('<li>加载新闻失败 请稍后重试</li>');
            }
        });
    }

    // 更新分页显示
    function updatePagination() {
        $('#currentPage').text(config.currentPage);
        $('#totalPages').text(config.totalPages);
    }

    // 更新按钮状态
    function updateButtonStates() {
        $('#prevPage').prop('disabled', config.currentPage <= 1);
        $('#nextPage').prop('disabled', config.currentPage >= config.totalPages);
    }

    // 绑定翻页按钮事件
    $('#prevPage').click(function () {
        if (config.currentPage > 1) {
            config.currentPage--;
            loadNews(config.currentPage);
        }
    });

    $('#nextPage').click(function () {
        if (config.currentPage < config.totalPages) {
            config.currentPage++;
            loadNews(config.currentPage);
        }
    });

    // 初始加载第一页
    loadNews(1);
});