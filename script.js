document.addEventListener('DOMContentLoaded', function() {
    const viewCardBtn = document.getElementById('viewCardBtn');
    const cardContent = document.getElementById('cardContent');
    const particleContainer = document.getElementById('particle-container');
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722']; // Danh sách màu sắc

    if (viewCardBtn && cardContent) {
        viewCardBtn.addEventListener('click', function(event) {
            // Ẩn nút và các phần tử trang chào ban đầu TRƯỚC khi thiệp hiện ra
            viewCardBtn.style.display = 'none';
            const mainTitle = document.querySelector('.container h1');
            const mainParagraph = document.querySelector('.container p');
            if (mainTitle) mainTitle.style.display = 'none';
            if (mainParagraph) mainParagraph.style.display = 'none';

            // Kích hoạt hiệu ứng mở màn cho thiệp
            cardContent.style.display = 'block'; // Bước 1: Hiển thị div
            
            requestAnimationFrame(() => {
                // Bước 2: Kích hoạt transition
                cardContent.classList.add('card-show');
                
                // Lấy vị trí thiệp SAU KHI nó được hiển thị trong DOM
                const cardRect = cardContent.getBoundingClientRect();
                createExplosionEffect(cardRect); // Gọi hàm hiệu ứng nổ
            });
        });
    }

    // HÀM TẠO HIỆU ỨNG NỔ MỚI VỚI BỐ CỤC RẢI RÁC VÀ ĐỘ TRỄ
    function createExplosionEffect(cardRect) {
        const numBursts = 10; // Số lượng điểm nổ bạn muốn
        const numParticlesPerBurst = 20; // Số lượng hạt cho mỗi điểm nổ
        const burstDuration = 1.8; // Thời gian hiệu ứng nổ (giây)
        const burstDistance = 250; // Khoảng cách tối đa các hạt bay ra (pixels)
        const explosionPadding = 100; // Vùng đệm xung quanh thiệp (ví dụ: 100px)

        const cardMidX = cardRect.left + cardRect.width / 2;
        const cardMidY = cardRect.top + cardRect.height / 2;

        // Định nghĩa khung bao "vùng nổ" xung quanh thiệp
        const explosionMinX = cardRect.left - explosionPadding;
        const explosionMaxX = cardRect.right + explosionPadding;
        const explosionMinY = cardRect.top - explosionPadding;
        const explosionMaxY = cardRect.bottom + explosionPadding;

        const burstOrigins = [];
        // Tạo ra 10 điểm nổ ngẫu nhiên trong vùng này
        for (let i = 0; i < numBursts; i++) {
            const x = Math.random() * (explosionMaxX - explosionMinX) + explosionMinX;
            const y = Math.random() * (explosionMaxY - explosionMinY) + explosionMinY;
            burstOrigins.push({ x, y });
        }

        const delayBetweenGroups = 0.15; // Độ trễ giữa mỗi nhóm nổ (ví dụ: 0.15 giây)

        // Duyệt qua từng điểm nổ được tạo ra
        burstOrigins.forEach((origin, index) => {
            // Tính toán vector cơ bản từ tâm thiệp đến điểm nổ này
            let baseDx = origin.x - cardMidX;
            let baseDy = origin.y - cardMidY;
            const magnitude = Math.sqrt(baseDx * baseDx + baseDy * baseDy);

            // Chuẩn hóa vector hoặc tạo hướng ngẫu nhiên nếu điểm nổ quá gần tâm
            if (magnitude < 10 || (baseDx === 0 && baseDy === 0)) { 
                const randomAngle = Math.random() * Math.PI * 2;
                baseDx = Math.cos(randomAngle);
                baseDy = Math.sin(randomAngle);
            } else {
                baseDx /= magnitude;
                baseDy /= magnitude;
            }

            for (let i = 0; i < numParticlesPerBurst; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                particle.style.backgroundColor = colors[(Math.floor(Math.random() * colors.length))];
                particle.style.width = `${Math.random() * 8 + 5}px`;
                particle.style.height = particle.style.width; 

                // Vị trí ban đầu của hạt chính là điểm nổ
                particle.style.left = `${origin.x}px`;
                particle.style.top = `${origin.y}px`;

                // Tính toán góc bay của hạt dựa trên hướng cơ bản và thêm ngẫu nhiên
                const angleOffset = (Math.random() * Math.PI / 3) - (Math.PI / 6); // +/- 30 độ
                const baseAngle = Math.atan2(baseDy, baseDx); 
                const targetAngle = baseAngle + angleOffset;

                const targetX = Math.cos(targetAngle) * burstDistance;
                const targetY = Math.sin(targetAngle) * burstDistance;

                const rotation = Math.random() * 360;
                const scale = Math.random() * 0.5 + 0.7;
                
                // ĐỘ TRỄ: Tổng của độ trễ nhóm và độ trễ cá nhân của hạt
                const particleDelay = (Math.random() * 0.5) + (index * delayBetweenGroups);

                particle.style.animation = `confetti-burst ${burstDuration}s ease-out forwards`;
                particle.style.setProperty('--target-x', `${targetX}px`);
                particle.style.setProperty('--target-y', `${targetY}px`);
                particle.style.setProperty('--rotation', `${rotation}deg`);
                particle.style.setProperty('--scale', `${scale}`);
                particle.style.animationDelay = `${particleDelay}s`;

                particleContainer.appendChild(particle);

                particle.addEventListener('animationend', () => {
                    particle.remove();
                });
            }
        });
    }
});