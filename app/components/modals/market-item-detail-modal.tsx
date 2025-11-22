"use client";

import * as React from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { MarketItem } from "@/app/services.tsx/api-client";
import { useMarketItem } from "@/app/hooks/use-market-query";
import { Loading } from "../ui/loading";
import { ErrorState } from "../ui/error-state";
import Image from "next/image";
import { EyeIcon, EditIcon, TrashIcon } from "../ui/icons";

interface MarketItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  onEdit: (item: MarketItem) => void;
  onDelete: (item: MarketItem) => void;
  canEdit?: boolean;
}

export const MarketItemDetailModal: React.FC<MarketItemDetailModalProps> = ({
  isOpen,
  onClose,
  itemId,
  onEdit,
  onDelete,
  canEdit = false,
}) => {
  const { data: item, isLoading, error } = useMarketItem(itemId);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Market Item Details"
      size="lg"
      footer={
        <div className="flex items-center gap-3 w-full">
          <Button variant="ghostly" onClick={onClose} className="flex-1">
            Close
          </Button>
          {canEdit && item && (
            <>
              <Button
                variant="default"
                onClick={() => {
                  onEdit(item);
                  onClose();
                }}
                icon={<EditIcon />}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(item);
                  onClose();
                }}
                icon={<TrashIcon />}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      }
    >
      {isLoading ? (
        <div className="py-8">
          <Loading size="md" text="Loading item details..." />
        </div>
      ) : error ? (
        <ErrorState
          message={error.message || "Failed to load item details"}
          onRetry={() => window.location.reload()}
        />
      ) : item ? (
        <div className="space-y-6">
          {/* Image */}
          {item.media && item.media.length > 0 && (
            <div className="w-full h-64 bg-[#171717] rounded-[16px] overflow-hidden">
              <Image
                src={item.media[0].url}
                alt={item.title}
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title and Price */}
          <div>
            <h2 className="text-white/95 text-2xl font-medium mb-2">
              {item.title}
            </h2>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[#A3A3A3] text-sm">Price</span>
                <p className="text-white/95 text-xl font-medium">
                  ${item.price} {item.currency}
                </p>
              </div>
              {item.stock !== undefined && (
                <div>
                  <span className="text-[#A3A3A3] text-sm">Stock</span>
                  <p className="text-white/95 text-lg font-medium">
                    {item.stock} available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-white/95 text-sm font-medium mb-2">
              Description
            </h3>
            <p className="text-[#A3A3A3] text-sm leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[#A3A3A3] text-xs">Category</span>
              <p className="text-white/95 text-sm font-medium">
                {item.category?.title || "Uncategorized"}
              </p>
            </div>
            <div>
              <span className="text-[#A3A3A3] text-xs">Status</span>
              <p className="text-white/95 text-sm font-medium capitalize">
                {item.status}
              </p>
            </div>
            <div>
              <span className="text-[#A3A3A3] text-xs">Seller</span>
              <p className="text-white/95 text-sm font-medium font-mono">
                {item.seller?.walletAddress?.slice(0, 8)}...
                {item.seller?.walletAddress?.slice(-6)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <EyeIcon />
              <span className="text-[#A3A3A3] text-xs">{item.views} views</span>
            </div>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <span className="text-[#A3A3A3] text-xs mb-2 block">Tags</span>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#262626] text-[#A3A3A3] text-xs rounded-[6px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Media Gallery */}
          {item.media && item.media.length > 1 && (
            <div>
              <span className="text-[#A3A3A3] text-xs mb-2 block">
                Additional Media
              </span>
              <div className="grid grid-cols-3 gap-2">
                {item.media.slice(1).map((media, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-[#171717] rounded-[10px] overflow-hidden"
                  >
                    <Image
                      src={media.url}
                      alt={`${item.title} - ${index + 2}`}
                      width={200}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
};

export default MarketItemDetailModal;

