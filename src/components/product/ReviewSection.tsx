import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User } from 'lucide-react';
import { useReviewStore } from '../../stores/reviewStore';
import { useAuthStore } from '../../stores/authStore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ReviewSectionProps {
  productId: string;
}

interface ReviewForm {
  rating: number;
  comment: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { reviews, loading, fetchReviews, addReview } = useReviewStore();
  const { user, isAuthenticated } = useAuthStore();
  const { register, handleSubmit, reset, setValue, watch } = useForm<ReviewForm>();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchReviews(productId);
  }, [productId, fetchReviews]);

  const onSubmit = async (data: ReviewForm) => {
    if (!isAuthenticated) {
      toast.error('Please login to leave a review');
      return;
    }

    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    const success = await addReview(productId, selectedRating, data.comment);
    if (success) {
      toast.success('Review added successfully!');
      setShowReviewForm(false);
      setSelectedRating(0);
      reset();
    } else {
      toast.error('Failed to add review');
    }
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
            </span>
          </div>
        </div>
        
        {isAuthenticated && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Write Review</span>
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-4">Write Your Review</h4>
          
          {/* Star Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleStarClick(i + 1)}
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      i < (hoverRating || selectedRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              {...register('comment', { required: 'Please write a comment' })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your experience with this product..."
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm(false);
                setSelectedRating(0);
                reset();
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{review.userName}</h5>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}