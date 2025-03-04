"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiSave, FiX, FiImage } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Import your Zod schema
import type { z } from "zod";
import { gamesSchema } from "@/app/lib/schema";
import Game from "@/app/types/game";
import { GameService } from "@/app/services/game-service";

type GameFormData = Omit<Game, "id" | "createdAt" | "updatedAt">;

interface GameFormProps {
  initialData?: GameFormData;
  gameId?: number;
  onSuccess?: () => void;
}

export default function GameForm({
  initialData,
  gameId,
  onSuccess,
}: GameFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.image || null
  );

  const isEditMode = !!gameId;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<GameFormData>({
    resolver: zodResolver(gamesSchema),
    defaultValues: initialData || {
      title: "",
      price: 0,
      image: "",
      description: "",
    },
    mode: "onChange",
  });

  const imageValue = watch("image");
  console.log("Form errors:", errors);

  useEffect(() => {
    if (imageValue && typeof imageValue === "string") {
      setPreviewImage(imageValue);
    }
  }, [imageValue]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setPreviewImage(initialData.image || null);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: GameFormData) => {
    console.log("test submit");
    setIsSubmitting(true);

    try {
      const response = isEditMode
        ? GameService.updateGame(gameId.toString(), data)
        : GameService.createGame(data);

      toast.success(
        isEditMode ? "Game updated successfully!" : "Game created successfully!"
      );

      if (onSuccess) onSuccess();

      if (!isEditMode) {
        reset();
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Error saving game:", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Game Title</span>
          </label>
          <input
            type="text"
            className={`input input-bordered w-full ${
              errors.title ? "input-error" : ""
            }`}
            placeholder="Enter game title"
            {...register("title")}
          />
          {errors.title && (
            <span className="text-error text-sm mt-1">
              {errors.title.message as string}
            </span>
          )}
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Price</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              className={`input input-bordered w-full pl-8 ${
                errors.price ? "input-error" : ""
              }`}
              placeholder="0.00"
              {...register("price", { valueAsNumber: true })}
            />
          </div>
          {errors.price && (
            <span className="text-error text-sm mt-1">
              {errors.price.message as string}
            </span>
          )}
        </div>
      </div>

      {/* Image URL */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Image URL</span>
        </label>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            className={`input input-bordered w-full ${
              errors.image ? "input-error" : ""
            }`}
            placeholder="https://example.com/image.jpg"
            {...register("image")}
          />
          {previewImage && (
            <div className="avatar">
              <div className="w-16 h-16 rounded">
                <img
                  src={previewImage}
                  alt="Preview"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/100x100?text=Error";
                  }}
                />
              </div>
            </div>
          )}
        </div>
        {errors.image && (
          <span className="text-error text-sm mt-1">
            {errors.image.message as string}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          className={`textarea textarea-bordered h-32 ${
            errors.description ? "textarea-error" : ""
          }`}
          placeholder="Enter game description"
          {...register("description")}
        ></textarea>
        {errors.description && (
          <span className="text-error text-sm mt-1">
            {errors.description.message as string}
          </span>
        )}
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => onSuccess && onSuccess()}
          className="btn btn-outline"
          disabled={isSubmitting}
        >
          <FiX className="mr-2" /> Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          <FiSave className="mr-2" />
          {isSubmitting ? "Saving..." : isEditMode ? "Update Game" : "Add Game"}
        </button>
      </div>
    </form>
  );
}
