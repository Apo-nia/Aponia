import AccessoryShop from '../../../components/AccessoryShop';

export default function ShopPage() {
  return (
    <main 
            className="relative flex min-h-screen flex-col items-center justify-center p-12"
            style={{
            backgroundImage: `url('/background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            }}
        >
        <div>
            <AccessoryShop userId={'user123'} />
        </div>
    </main>
  );
}
