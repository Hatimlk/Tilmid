<?php
require_once 'db.php';

header("Content-Type: application/xml; charset=utf-8");

$baseUrl = "https://tilmide.ma";

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Static Pages -->
    <url>
        <loc><?php echo $baseUrl; ?>/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc><?php echo $baseUrl; ?>/tilmid</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc><?php echo $baseUrl; ?>/talib</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc><?php echo $baseUrl; ?>/tawjih</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc><?php echo $baseUrl; ?>/coaching-offer</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc><?php echo $baseUrl; ?>/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc><?php echo $baseUrl; ?>/student-area</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc><?php echo $baseUrl; ?>/about</loc>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>

    <!-- Dynamic Blog Posts -->
    <?php
    try {
        // Fetch all blog posts
        $stmt = $pdo->query("SELECT id, created_at FROM posts WHERE status = 'published' ORDER BY created_at DESC");
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($posts as $post) {
            $lastMod = date('Y-m-d', strtotime($post['created_at']));
            echo "    <url>\n";
            echo "        <loc>" . htmlspecialchars($baseUrl . '/blog/' . (int)$post['id'], ENT_XML1 | ENT_QUOTES, 'UTF-8') . "</loc>\n";
            echo "        <lastmod>" . htmlspecialchars($lastMod, ENT_XML1, 'UTF-8') . "</lastmod>\n";
            echo "        <changefreq>weekly</changefreq>\n";
            echo "        <priority>0.7</priority>\n";
            echo "    </url>\n";
        }
    } catch (PDOException $e) {
        // Silently fail or log error, but don't break XML structure if possible
        // Ideally, we might want to comment out the error in XML
    }
    ?>
</urlset>
