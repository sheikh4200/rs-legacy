// components/Products/ReviewsProduct.tsx
'use client';

interface ReviewsProductProps {
  productId: string;
}

const ReviewsProduct: React.FC<ReviewsProductProps> = ({ productId }) => {
  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      date: "2024-01-15",
      comment: "Great product! Fits perfectly and very comfortable.",
      verified: true
    },
    {
      id: 2,
      name: "Jane Smith",
      rating: 4,
      date: "2024-01-10",
      comment: "Good quality fabric, but runs a bit large. Size down if between sizes.",
      verified: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer Reviews</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Write a Review
        </button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">{review.name}</span>
                {review.verified && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
            </div>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-lg ${
                    star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsProduct;