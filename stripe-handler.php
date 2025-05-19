<?php
require 'vendor/autoload.php';
require 'stripe-config.php';

\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

function createCheckoutSession($priceId, $mode) {
    $origin = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
    $success_url = $origin . "/success.html";
    $cancel_url = $origin . "/cancel.html";

    try {
        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $priceId,
                'quantity' => 1,
            ]],
            'mode' => $mode,
            'success_url' => $success_url,
            'cancel_url' => $cancel_url,
        ]);

        return ['url' => $session->url];
    } catch(Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $productId = $data['productId'] ?? '';

    if (isset(STRIPE_PRODUCTS[$productId])) {
        $product = STRIPE_PRODUCTS[$productId];
        $result = createCheckoutSession($product['priceId'], $product['mode']);
        
        header('Content-Type: application/json');
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid product ID']);
    }
}
?>