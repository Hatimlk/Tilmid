<?php
/**
 * Simple JWT Helper Class (Zero Dependency)
 */
class JWT {
    // Generate token
    public static function encode($payload, $secret) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($payload);
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    // Verify and decode token
    public static function decode($token, $secret) {
        $parts = explode('.', $token);
        if (count($parts) != 3) return null;

        $header = $parts[0];
        $payload = $parts[1];
        $signatureProvided = $parts[2];

        // Verify Signature
        $signatureGenerated = hash_hmac('sha256', $header . "." . $payload, $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signatureGenerated));

        if ($base64UrlSignature !== $signatureProvided) return null;

        return json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $payload)), true);
    }
}
?>
