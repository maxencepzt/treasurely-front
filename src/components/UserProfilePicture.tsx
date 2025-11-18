import { type SyntheticEvent, useEffect, useState } from 'react';

import { type User } from "../types/api";

const CACHE_NAME = 'profile-pictures-cache';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 jours

async function getCachedImage(url: string): Promise<string | null> {
  if (!('caches' in window)) return null;

  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);

    if (response) {
      const cachedTime = response.headers.get('x-cached-time');
      if (cachedTime && Date.now() - Number(cachedTime) < CACHE_EXPIRY) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }
  return null;
}

async function cacheImage(url: string): Promise<string> {
  if (!('caches' in window)) return url;

  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const headers = new Headers(response.headers);
    headers.set('x-cached-time', Date.now().toString());

    const cachedResponse = new Response(blob, {
      status: response.status,
      statusText: response.statusText,
      headers
    });

    const cache = await caches.open(CACHE_NAME);
    await cache.put(url, cachedResponse);

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Cache write error:', error);
    return url;
  }
}

function UserProfilePicture({ userData, size = 64 }: { userData?: User, size?: number }) {
  const [imageUrl, setImageUrl] = useState<string>("/user_profile_picture_default.png");

  useEffect(() => {
    const profilePicUrl = userData?.profilePicture;
    if (!profilePicUrl || profilePicUrl === "/user_profile_picture_default.png") {
      setImageUrl("/user_profile_picture_default.png");
      return;
    }

    let isMounted = true;

    getCachedImage(profilePicUrl).then(cachedUrl => {
      if (!isMounted) return;

      if (cachedUrl) {
        setImageUrl(cachedUrl);
      } else {
        cacheImage(profilePicUrl).then(url => {
          if (isMounted) setImageUrl(url);
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [userData?.profilePicture]);

  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = "/user_profile_picture_default.png";
  };

  return (
    <div className="flex justify-center">
      <img
        src={imageUrl}
        alt={userData?.nickname || "Default avatar"}
        style={{ width: size, height: size, borderRadius: '50%'}}
        onError={handleImageError}
      />
    </div>
  );
}

export default UserProfilePicture;
