function parseCSV(str) {
    const arr = [];
    let quote = false;  // 是否在引号内
    let row = [];
    let cell = '';

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const nextChar = str[i + 1];

        if (quote) {
            if (char === '"') {
                if (nextChar === '"') {
                    cell += '"';
                    i++;
                } else {
                    quote = false;
                }
            } else {
                cell += char;
            }
        } else {
            if (char === '"') {
                quote = true;
            } else if (char === ',') {
                row.push(cell.trim());
                cell = '';
            } else if (char === '\n' || char === '\r') {
                if (nextChar === '\n') {
                    i++;
                }
                row.push(cell.trim());
                arr.push(row);
                row = [];
                cell = '';
            } else {
                cell += char;
            }
        }
    }

    if (cell) {
        row.push(cell.trim());
    }
    if (row.length) {
        arr.push(row);
    }

    return arr;
}
$(document).ready(function () {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const personId = urlParams.get('id');

    if (personId) {
        // 使用 AJAX 加载 CSV 文件
        $.ajax({
            url: '../data/information.csv',
            dataType: 'text',
            success: function (data) {
                // 解析 CSV 数据
                const rows = parseCSV(data);
                const headers = rows[0];
                // 查找对应的人员信息
                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i];
                    if (values[0] === personId) { // 假设第一列是ID
                        // 更新页面信息
                        updateProfile(headers, values);
                        break;
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error('Error loading CSV:', error);
            }
        });
    }
});
function updateProfile(headers, values) {
    // 更新个人信息
    $('.profile-name').text(values[1]); // 假设第二列是姓名
    $('.profile-description').text(values[2]); // 假设第三列是描述

    // 更新指导教师信息
    if (values[3]) {
        $('.profile-info:first').html(`<p class="fw-bold">邮箱: ${values[3]} </p>`);
    }

    // 更新头像
    if (values[1]) {
        $('.profile-image').attr('src', `../images/team-avatar/${values[1]}.jpg`);
    }

    // 更新社交链接
    if (values[4]) { // Website
        $('.social-icons a[title="Website"]').attr('href', values[4]);
    }
    if (values[5]) { // GitHub
        $('.social-icons a[title="GitHub"]').attr('href', values[5]);
    }
    if (values[6]) { // Twitter
        $('.social-icons a[title="Google Scholar"]').attr('href', values[6]);
    }

    // 更新论文列表
    if (values[7]) {
        $('.achievement-section:eq(0)').show();
        $('.subsection-title').first().text('学术成果');
        const cleanValue = values[7].replace(/['"]/g, '');
        const papers = cleanValue.split('|');
        let paperHtml = '';
        papers.forEach(paper => {
            // 首先判断是否有链接
            if (paper.includes('&')) {
                const [content, link] = paper.split('&');
                // 再判断是否有journal信息
                if (content.includes(';')) {
                    const [title, journal] = content.split(';');
                    paperHtml += `
           <li class="publication-item">
               <a href="${link}" target="_blank" class="nav-link">
                <strong>${title}</strong>
                <em>${journal}</em>
               </a>
           </li>`;
                } else {
                    paperHtml += `
           <li class="publication-item">
               <a href="${link}" target="_blank" class="nav-link">
                <strong>${content}</strong>
               </a>
           </li>`;
                }
            } else {
                // 如果没有链接,直接显示内容
                if (paper.includes(';')) {
                    const [title, journal] = paper.split(';');
                    paperHtml += `
           <li class="publication-item">
               <strong>${title}</strong>
               <em>${journal}</em>
           </li>`;
                } else {
                    paperHtml += `
           <li class="publication-item">
               <strong>${paper}</strong>
           </li>`;
                }
            }
        });
        $('.publication-list').html(paperHtml);
    } else {
        $('.achievement-section:eq(0)').hide();
    }
    // 更新项目列表
    if (values[8]) {
        $('.achievement-section:eq(1)').show();
        $('.subsection-title:eq(1)').text('研究项目');
        const projects = values[8].split(';');
        let projectHtml = '';
        projects.forEach(project => {
            projectHtml += `
               <li class="project-item">
                   <strong>${project}</strong>
               </li>`;
        });
        $('.project-list').html(projectHtml);
    } else {
        $('.achievement-section:eq(1)').hide();
    }

    if (values[9] && values[9].trim()) {
        // 假设数据格式为: "081200,计算机科学与技术,1;083500,软件工程,1;085400,电子信息,1"
        $('.achievement-section:eq(2)').show();
        $('.subsection-title:eq(2)').text('招生信息');
        const admissions = values[9].split(';');
        let admissionHtml = `
<table class="table table-bordered">
    <thead>
        <tr>
            <th class="text-center">专业代码</th>
            <th class="text-center">专业名称</th>
            <th class="text-center">招生人数</th>
        </tr>
    </thead>
    <tbody>`;

        admissions.forEach(admission => {
            const [code, name, count] = admission.split('&');
            admissionHtml += `
        <tr>
            <td class="text-center">${code}</td>
            <td class="text-center">${name}</td>
            <td class="text-center">${count}</td>
        </tr>`;
        });

        admissionHtml += `
    </tbody>
</table>`;
        $('.admission-list').html(admissionHtml);
    } else {
        $('.achievement-section:eq(2)').hide();
        $('.admission-list').empty(); // 清空列表内容
    }
    if (values[10] && values[10].trim()) {
        $('.achievement-section:eq(3)').show();
        $('.subsection-title:eq(3)').text('研究方向');
        const researchAreas = values[10].split(';');
        let researchHtml = '';
        researchAreas.forEach(area => {
            researchHtml += `<strong> ${area} </strong>`;
        });
        $('.research-area').html(researchHtml);
    } else {
        $('.achievement-section:eq(3)').hide();
    }
}