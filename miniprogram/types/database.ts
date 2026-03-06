export type VenueCategory = 'shopping' | 'hospital' | 'school' | 'transport' | 'park' | 'building' | 'other'

export type VenueStatus = 'active' | 'inactive'

export interface Venue {
  id: string
  name: string
  category: VenueCategory
  address: string
  latitude: number
  longitude: number
  parent_id: string | null
  status: VenueStatus
  created_at: string
  updated_at: string
}

export interface VenueWithDistance extends Venue {
  distance: number
}

export type PostType = 'queue' | 'crowd' | 'lost' | 'reminder' | 'other'

export type PostStatus = 'active' | 'expired' | 'deleted'

export interface Post {
  id: string
  venue_id: string
  user_id: string
  type: PostType
  content: string
  images: string[] | null
  expires_at: string
  status: PostStatus
  like_count: number
  view_count: number
  created_at: string
  updated_at: string
}

export interface PostWithVenue extends Post {
  venue: Venue
}

export type ApplicationType = 'create_venue' | 'create_subvenue' | 'modify_venue' | 'delete_venue'

export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface Application {
  id: string
  user_id: string
  type: ApplicationType
  venue_id: string | null
  venue_data: Partial<Venue>
  status: ApplicationStatus
  review_note: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  created_at: string
  updated_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  venue_id: string
  created_at: string
}

export interface UserFavoriteWithVenue extends UserFavorite {
  venue: Venue
}

export interface UserProfile {
  id: string
  nickname: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
