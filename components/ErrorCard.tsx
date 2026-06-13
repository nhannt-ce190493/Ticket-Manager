import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { TriangleAlert } from 'lucide-react';

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

/**
 * ErrorCard — hiển thị lỗi với nút thử lại tuỳ chọn.
 */
export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
      <TriangleAlert className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-700">Đã xảy ra lỗi</AlertTitle>
      <AlertDescription className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-red-600">
        <span>{message}</span>
        {onRetry && (
          <Button
            id="error-retry-btn"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0 border-red-300 text-red-600 hover:bg-red-100"
          >
            Thử lại
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

