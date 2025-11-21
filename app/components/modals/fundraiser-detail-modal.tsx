"use client";

import * as React from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Fundraiser } from "@/app/services.tsx/api-client";
import { useFundraiser } from "@/app/hooks/use-fundraiser-query";
import { Loading } from "../ui/loading";
import { ErrorState } from "../ui/error-state";
import Image from "next/image";
import { EyeIcon, EditIcon, TrashIcon } from "../ui/icons";

interface FundraiserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundraiserId: string;
  onEdit: (fundraiser: Fundraiser) => void;
  onDelete: (fundraiser: Fundraiser) => void;
  canEdit?: boolean;
}

export const FundraiserDetailModal: React.FC<FundraiserDetailModalProps> = ({
  isOpen,
  onClose,
  fundraiserId,
  onEdit,
  onDelete,
  canEdit = false,
}) => {
  const { data: fundraiser, isLoading, error } = useFundraiser(fundraiserId);

  if (!isOpen) return null;

  const raised = fundraiser?.totalRaised || fundraiser?.raised || 0;
  const progress = fundraiser
    ? Math.min((raised / fundraiser.goal) * 100, 100)
    : 0;
  const daysRemaining = fundraiser
    ? Math.ceil(
        (new Date(fundraiser.deadlineAt).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fundraiser Details"
      size="lg"
      footer={
        <div className="flex items-center gap-3 w-full">
          <Button variant="ghostly" onClick={onClose} className="flex-1">
            Close
          </Button>
          {canEdit && fundraiser && (
            <>
              <Button
                variant="default"
                onClick={() => {
                  onEdit(fundraiser);
                  onClose();
                }}
                icon={<EditIcon />}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(fundraiser);
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
          <Loading size="md" text="Loading fundraiser details..." />
        </div>
      ) : error ? (
        <ErrorState
          message={error.message || "Failed to load fundraiser details"}
          onRetry={() => window.location.reload()}
        />
      ) : fundraiser ? (
        <div className="space-y-6">
          {/* Image */}
          {fundraiser.media && fundraiser.media.length > 0 && (
            <div className="w-full h-64 bg-[#171717] rounded-[16px] overflow-hidden">
              <Image
                src={fundraiser.media[0].url}
                alt={fundraiser.title}
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title and Summary */}
          <div>
            <h2 className="text-white/95 text-2xl font-medium mb-2">
              {fundraiser.title}
            </h2>
            <p className="text-[#A3A3A3] text-sm">{fundraiser.summary}</p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#A3A3A3] text-sm">Progress</span>
              <span className="text-white/95 text-sm font-medium">
                {progress.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#262626] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#335CFF] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-white/95 text-lg font-medium">
                ${raised.toLocaleString()} raised
              </span>
              <span className="text-[#A3A3A3] text-sm">
                of ${fundraiser.goal.toLocaleString()} goal
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-white/95 text-sm font-medium mb-2">
              Description
            </h3>
            <p className="text-[#A3A3A3] text-sm leading-relaxed">
              {fundraiser.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[#A3A3A3] text-xs">Category</span>
              <p className="text-white/95 text-sm font-medium">
                {fundraiser.category?.title || "Uncategorized"}
              </p>
            </div>
            <div>
              <span className="text-[#A3A3A3] text-xs">Status</span>
              <p className="text-white/95 text-sm font-medium capitalize">
                {fundraiser.status}
              </p>
            </div>
            <div>
              <span className="text-[#A3A3A3] text-xs">Owner</span>
              <p className="text-white/95 text-sm font-medium font-mono">
                {fundraiser.owner?.walletAddress?.slice(0, 8)}...
                {fundraiser.owner?.walletAddress?.slice(-6)}
              </p>
            </div>
            <div>
              <span className="text-[#A3A3A3] text-xs">Deadline</span>
              <p className="text-white/95 text-sm font-medium">
                {daysRemaining > 0
                  ? `${daysRemaining} days left`
                  : "Expired"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <EyeIcon />
              <span className="text-[#A3A3A3] text-xs">
                {fundraiser.views} views
              </span>
            </div>
          </div>

          {/* Tags */}
          {fundraiser.tags && fundraiser.tags.length > 0 && (
            <div>
              <span className="text-[#A3A3A3] text-xs mb-2 block">Tags</span>
              <div className="flex flex-wrap gap-2">
                {fundraiser.tags.map((tag, index) => (
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
          {fundraiser.media && fundraiser.media.length > 1 && (
            <div>
              <span className="text-[#A3A3A3] text-xs mb-2 block">
                Additional Media
              </span>
              <div className="grid grid-cols-3 gap-2">
                {fundraiser.media.slice(1).map((media, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-[#171717] rounded-[10px] overflow-hidden"
                  >
                    <Image
                      src={media.url}
                      alt={`${fundraiser.title} - ${index + 2}`}
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

export default FundraiserDetailModal;

