"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, User as UserIcon, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { ProfileService, type ProfileData } from "@/services/profile.service";

const profileSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  pharmacyName: z.string().min(2, "Pharmacy name is required"),
  licenseNumber: z.string().min(5, "License number is required"),
  address: z.string().min(5, "Full address is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

interface Props {
  /** Pre-fetched profile data from the server component. */
  initialData: ProfileData;
}

export default function ProfileForm({ initialData }: Props) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData.avatarUrl ?? null
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
      pharmacyName: initialData.pharmacyName,
      licenseNumber: initialData.licenseNumber,
      address: initialData.address,
    },
  });

  // Sync form if the server re-sends new initialData (e.g. after navigation)
  useEffect(() => {
    reset(
      {
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        pharmacyName: initialData.pharmacyName,
        licenseNumber: initialData.licenseNumber,
        address: initialData.address,
      },
      { keepDefaultValues: false }
    );
    setAvatarPreview(initialData.avatarUrl ?? null);
  }, [initialData, reset]);

  /* ─── Avatar upload ─── */
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Please use JPG, PNG, GIF, or WebP.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File is too large. Maximum size is 2 MB.");
      return;
    }

    const previousPreview = avatarPreview;
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setIsUploadingAvatar(true);

    const uploadToast = toast.loading("Uploading avatar...");
    try {
      const result = await ProfileService.uploadAvatar(file);
      if (result?.avatarUrl) {
        URL.revokeObjectURL(objectUrl);
        setAvatarPreview(result.avatarUrl);
      }
      toast.success("Avatar updated successfully!", { id: uploadToast });
    } catch {
      toast.error("Failed to upload avatar. Please try again.", {
        id: uploadToast,
      });
      URL.revokeObjectURL(objectUrl);
      setAvatarPreview(previousPreview);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  /* ─── Form submit ─── */
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await ProfileService.updateProfile(data);
      toast.success("Profile updated successfully!");
      reset(data, { keepDefaultValues: false });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">
          Personal &amp; Pharmacy Details
        </h2>
        <p className="text-sm text-gray-500">
          Update your professional information here.
        </p>
      </div>

      <div className="p-6">
        {/* ─── Avatar ─── */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative flex-shrink-0 group">
            <div className="h-20 w-20 rounded-full bg-sky-100 border-2 border-sky-200 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserIcon className="h-10 w-10 text-sky-400" />
              )}
            </div>
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              aria-label="Change profile photo"
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
            >
              {isUploadingAvatar ? (
                <Loader2 size={20} className="animate-spin text-white" />
              ) : (
                <Camera size={18} className="text-white" />
              )}
            </button>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleAvatarUpload}
              disabled={isUploadingAvatar}
            />
            <label
              htmlFor="avatar-upload"
              className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm font-medium shadow-sm select-none ${
                isUploadingAvatar
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
            >
              {isUploadingAvatar ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              {isUploadingAvatar ? "Uploading..." : "Change Photo"}
            </label>
            <p className="text-xs text-gray-400 mt-2">
              JPG, GIF, PNG or WebP · Max 2 MB
            </p>
          </div>
        </div>

        {/* ─── Form ─── */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="profile-name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="profile-name"
                {...register("name")}
                placeholder="e.g. Dr. Sarah Chen"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="profile-email"
                {...register("email")}
                type="email"
                readOnly
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm focus:outline-none cursor-not-allowed transition-shadow"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="profile-phone"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Phone Number
              </label>
              <input
                id="profile-phone"
                {...register("phone")}
                placeholder="+880 1712-345678"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="profile-pharmacy"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Pharmacy Name
              </label>
              <input
                id="profile-pharmacy"
                {...register("pharmacyName")}
                placeholder="e.g. City Health Pharmacy"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"
              />
              {errors.pharmacyName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.pharmacyName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-license"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              License Number
            </label>
            <input
              id="profile-license"
              {...register("licenseNumber")}
              readOnly
              placeholder="e.g. PH-2023-8901"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm focus:outline-none cursor-not-allowed transition-shadow"
            />
            {errors.licenseNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.licenseNumber.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="profile-address"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Pharmacy Address
            </label>
            <textarea
              id="profile-address"
              {...register("address")}
              rows={3}
              placeholder="e.g. 123 Healthcare Ave, Dhaka"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow resize-none"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-gray-100 mt-8">
            <div className="flex flex-col">
              {isDirty && (
                <span className="text-xs text-amber-600 font-medium flex items-center gap-1 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  You have unsaved changes
                </span>
              )}
              {!isDirty && !isSubmitting && (
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Profile is up to date
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => reset()}
                disabled={!isDirty || isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-0 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isDirty || isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white rounded-xl transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-sky-100 hover:shadow-sky-200"
              >
                {isSubmitting && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {isSubmitting ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
