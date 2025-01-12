$(document).ready(function() {
    // 加载新闻数据
    function loadLatestNews() {
        $.ajax({
            url: 'data/news.json',
            method: 'GET',
            success: function(response) {
                // 获取前5条新闻
                const latestNews = response.slice(0, 5);
                
                // 清空现有列表
                $('.list-group').empty();
                
                // 添加新闻条目
                latestNews.forEach(item => {
                    const newsItem = `
                        <a href="${item.link || '#'}" class="list-group-item list-group-item-action py-3" target="_blank">
                            <div class="d-flex w-100 justify-content-between flex-nowrap">
                                <div class="me-3" style="flex: 1; min-width: 0;">
                                    <h6 class="mb-0 text-truncate">${item.title}</h6>
                                </div>
                                <small class="opacity-50 text-nowrap d-none d-sm-block">${item.date}</small>
                            </div>
                        </a>
                    `;
                    $('.list-group').append(newsItem);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error loading news:', error);
                $('.list-group').html('<div class="text-center">加载新闻失败 请稍后重试 </div>');
            }
        });
    }

    // 初始加载
    loadLatestNews();
});
