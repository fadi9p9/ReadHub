<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نظام إدارة المكتبة الإلكترونية</title>
    <style>
        :root {
            --primary-color: #2c3e50;
            --secondary-color: #3498db;
            --accent-color: #e74c3c;
            --light-color: #ecf0f1;
            --dark-color: #2c3e50;
        }
        
        body {
            font-family: 'Tajawal', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background-color: var(--primary-color);
            color: white;
            padding: 20px 0;
            text-align: center;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        header h1 {
            margin: 0;
            font-size: 2.5rem;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: 250px 1fr;
            gap: 20px;
            margin-top: 30px;
        }
        
        .sidebar {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .sidebar nav ul {
            list-style: none;
            padding: 0;
        }
        
        .sidebar nav ul li {
            margin-bottom: 15px;
        }
        
        .sidebar nav ul li a {
            display: flex;
            align-items: center;
            color: var(--dark-color);
            text-decoration: none;
            padding: 10px;
            border-radius: 5px;
            transition: all 0.3s;
        }
        
        .sidebar nav ul li a:hover {
            background-color: var(--secondary-color);
            color: white;
        }
        
        .sidebar nav ul li a i {
            margin-left: 10px;
            font-size: 1.2rem;
        }
        
        .main-content {
            background-color: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .stats-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background-color: var(--light-color);
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            transition: transform 0.3s;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-card h3 {
            margin-top: 0;
            color: var(--primary-color);
        }
        
        .stat-card .value {
            font-size: 2rem;
            font-weight: bold;
            color: var(--secondary-color);
            margin: 10px 0;
        }
        
        .recent-books {
            margin-top: 30px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        table th, table td {
            padding: 12px 15px;
            text-align: right;
            border-bottom: 1px solid #ddd;
        }
        
        table th {
            background-color: var(--primary-color);
            color: white;
        }
        
        table tr:hover {
            background-color: #f5f5f5;
        }
        
        .btn {
            display: inline-block;
            background-color: var(--secondary-color);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
            border: none;
            cursor: pointer;
            font-size: 1rem;
        }
        
        .btn:hover {
            background-color: #2980b9;
        }
        
        .btn-danger {
            background-color: var(--accent-color);
        }
        
        .btn-danger:hover {
            background-color: #c0392b;
        }
        
        .setup-instructions {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-top: 30px;
            border-left: 5px solid var(--secondary-color);
        }
        
        .setup-instructions h2 {
            color: var(--primary-color);
            margin-top: 0;
        }
        
        .setup-instructions code {
            background-color: #e9ecef;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
        }
        
        .setup-instructions pre {
            background-color: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        
        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
            }
            
            .stats-cards {
                grid-template-columns: 1fr;
            }
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <header>
        <div class="container">
            <h1><i class="fas fa-book-open"></i> نظام إدارة المكتبة الإلكترونية</h1>
        </div>
    </header>
    
    <div class="container">
        <div class="dashboard">
            <aside class="sidebar">
                <nav>
                    <ul>
                        <li><a href="#"><i class="fas fa-home"></i> الرئيسية</a></li>
                        <li><a href="#"><i class="fas fa-book"></i> الكتب</a></li>
                        <li><a href="#"><i class="fas fa-users"></i> الأعضاء</a></li>
                        <li><a href="#"><i class="fas fa-exchange-alt"></i> الإعارة</a></li>
                        <li><a href="#"><i class="fas fa-chart-bar"></i> التقارير</a></li>
                        <li><a href="#"><i class="fas fa-cog"></i> الإعدادات</a></li>
                    </ul>
                </nav>
            </aside>
            
            <main class="main-content">
                <div class="stats-cards">
                    <div class="stat-card">
                        <h3>الكتب المتاحة</h3>
                        <div class="value">1,245</div>
                        <p><i class="fas fa-book"></i></p>
                    </div>
                    <div class="stat-card">
                        <h3>الأعضاء المسجلين</h3>
                        <div class="value">568</div>
                        <p><i class="fas fa-users"></i></p>
                    </div>
                    <div class="stat-card">
                        <h3>الكتب المعارة</h3>
                        <div class="value">327</div>
                        <p><i class="fas fa-exchange-alt"></i></p>
                    </div>
                    <div class="stat-card">
                        <h3>متأخرات التسليم</h3>
                        <div class="value">42</div>
                        <p><i class="fas fa-clock"></i></p>
                    </div>
                </div>
                
                <div class="recent-books">
                    <h2><i class="fas fa-bookmark"></i> أحدث الإضافات</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>غلاف الكتاب</th>
                                <th>عنوان الكتاب</th>
                                <th>المؤلف</th>
                                <th>التصنيف</th>
                                <th>الحالة</th>
                                <th>إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><img src="https://via.placeholder.com/50x70" alt="غلاف الكتاب"></td>
                                <td>تعلم البرمجة مع جافاسكريبت</td>
                                <td>أحمد محمد</td>
                                <td>برمجة</td>
                                <td><span class="status available">متاح</span></td>
                                <td>
                                    <button class="btn"><i class="fas fa-eye"></i></button>
                                    <button class="btn"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-danger"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td><img src="https://via.placeholder.com/50x70" alt="غلاف الكتاب"></td>
                                <td>التصميم الجرافيكي الحديث</td>
                                <td>سارة عبد الله</td>
                                <td>تصميم</td>
                                <td><span class="status borrowed">معار</span></td>
                                <td>
                                    <button class="btn"><i class="fas fa-eye"></i></button>
                                    <button class="btn"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-danger"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td><img src="https://via.placeholder.com/50x70" alt="غلاف الكتاب"></td>
                                <td>تاريخ الحضارات</td>
                                <td>محمد علي</td>
                                <td>تاريخ</td>
                                <td><span class="status available">متاح</span></td>
                                <td>
                                    <button class="btn"><i class="fas fa-eye"></i></button>
                                    <button class="btn"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-danger"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="setup-instructions">
                    <h2><i class="fas fa-cogs"></i> تعليمات التشغيل</h2>
                    <h3>تثبيت المشروع:</h3>
                    <pre><code>$ npm install</code></pre>
                    
                    <h3>تشغيل المشروع:</h3>
                    <p>وضع التطوير:</p>
                    <pre><code>$ npm run start</code></pre>
                    
                    <p>وضع المتابعة (watch mode):</p>
                    <pre><code>$ npm run start:dev</code></pre>
                    
                    <p>وضع الإنتاج:</p>
                    <pre><code>$ npm run start:prod</code></pre>
                </div>
            </main>
        </div>
    </div>
</body>
</html>