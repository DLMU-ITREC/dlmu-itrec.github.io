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
                        <a href="${item.link || '#'}" class="list-group-item list-group-item-action d-flex gap-3 py-3" target="_blank">
                            <div class="d-flex gap-2 w-100 justify-content-between">
                                <div>
                                    <h6 class="mb-0 text-truncate" style="max-width: 600px;">${item.title}</h6>
                                </div>
                                <small class="opacity-50 text-nowrap">${item.date}</small>
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