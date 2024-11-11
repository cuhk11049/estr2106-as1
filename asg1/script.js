document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('toggleButton').addEventListener('click', function () {
        var extraButtons = document.getElementById('extraButtons');
        if (extraButtons.classList.contains('d-none')) {
            extraButtons.classList.remove('d-none');
            this.textContent = 'Hide';
        } else {
            extraButtons.classList.add('d-none');
            this.textContent = 'Show';
        }
    });

    document.getElementById('alignButton').addEventListener('click', function () {
        const textAlign = document.querySelector('main').style.textAlign;
        if (textAlign === 'left') {
            document.querySelector('main').style.textAlign = 'center';
        } else if (textAlign === 'center') {
            document.querySelector('main').style.textAlign = 'right';
        } else {
            document.querySelector('main').style.textAlign = 'left';
        }
    });

    document.getElementById('spotlightButton').addEventListener('click', function () {
        const spotlightText = prompt("Enter the company spotlight:");
        if (spotlightText) {
            document.getElementById('spotlightText').textContent = spotlightText;
        }
    });

    document.getElementById('toastButton').addEventListener('click', function () {
        const now = new Date();
        const timeString = 'Current time:  ' + now.getFullYear() + '-' +
            (now.getMonth() + 1).toString().padStart(2, '0') + '-' +
            now.getDate().toString().padStart(2, '0') + ' ' +
            now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0') + ':' +
            now.getSeconds().toString().padStart(2, '0');

        document.querySelector('#timeToast .toast-body').innerText = timeString;

        const toastElement = document.getElementById('timeToast');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    });

    document.getElementById('commentForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const form = event.target;

        if (form.checkValidity()) {
            addComment();
            form.reset();
            form.classList.remove('was-validated');
            saveComment(); // 添加评论后保存评论
        } else {
            form.classList.add('was-validated');
        }
    });

    loadComments(); // 页面加载时加载评论
});

function addComment() {
    const email = document.getElementById('email').value;
    const color = document.querySelector('input[name="color"]:checked').value;
    const commentText = document.getElementById('comment').value;

    const commentSection = document.getElementById('commentSection');
    const newComment = document.createElement('div');
    newComment.classList.add('comment', 'border', 'p-3', 'mb-3');

    const colorCircle = `<span class="color-circle" style="background-color: ${color.toLowerCase()}; width: 20px; height: 20px; border-radius: 50%; display: inline-block;"></span>`;

    newComment.innerHTML = `<p><strong>Email:</strong> ${email}</p>
                            <p><strong>Favorite Color:</strong> ${colorCircle} ${color}</p>
                            <p><strong>Comment:</strong> ${commentText}</p>`;

    commentSection.appendChild(newComment);
}

function loadComments() {
    const commentSection = document.getElementById('commentSection');
    commentSection.innerHTML = "";
    fetch("./assignment1.txt")
        .then(response => response.text())
        .then(data => {
            // 修改分割逻辑，按每两个换行分割评论
            const comments = data.split("\n\n").filter(comment => comment.trim() !== ""); // 分割评论并过滤空评论
            comments.forEach(comment => {
                console.log("Processing comment:", comment); // 查看每个评论的内容以便调试
                const lines = comment.split("\n");
                if (lines.length >= 3) {
                    const email = lines[0].split(": ")[1];
                    const color = lines[1].split(": ")[1];
                    const commentText = lines[2].split(": ")[1];
                    if (email && color && commentText) {
                        const newComment = document.createElement('div');
                        newComment.classList.add('comment', 'border', 'p-3', 'mb-3');
            
                        const colorCircle = `<span class="color-circle" style="background-color: ${color.toLowerCase()}; width: 20px; height: 20px; border-radius: 50%; display: inline-block;"></span>`;
            
                        newComment.innerHTML = `<p><strong>Email:</strong> ${email}</p>
                                                <p><strong>Favorite Color:</strong> ${colorCircle} ${color}</p>
                                                <p><strong>Comment:</strong> ${commentText}</p>`;
                        commentSection.appendChild(newComment);
                    }
                }
            });
            
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}


function saveComment() {
    let comments = "";
    document.querySelectorAll('.comment').forEach(commentElement => {
        const email = commentElement.querySelector('p:nth-child(1)').textContent.replace('Email: ', '').trim();
        const color = commentElement.querySelector('p:nth-child(2)').textContent.replace('Favorite Color: ', '').trim();
        const commentText = commentElement.querySelector('p:nth-child(3)').textContent.replace('Comment: ', '').trim();
        if (email && color && commentText) {
            comments += `Email: ${email}\nFavorite Color: ${color}\nComment: ${commentText}\n\n`;
        }
    });

    fetch("./assignment1.txt", {
        method: "PUT",
        headers: {
            "Content-Type": "text/plain"
        },
        body: comments
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log("Comments saved successfully:", data);
    })
    .catch(error => {
        console.error("Error saving comments:", error);
    });
}

