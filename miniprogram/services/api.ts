import { supabase } from '../lib/supabase'
import type {
  Venue,
  VenueWithDistance,
  Post,
  PostWithVenue,
  Application,
  UserFavorite,
  UserFavoriteWithVenue,
  UserProfile,
  VenueCategory,
  PostType,
  ApplicationStatus,
} from '../types/database'

class VenueService {
  async getNearbyVenues(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
    limit: number = 20
  ) {
    return supabase.rpc<VenueWithDistance[]>('get_nearby_venues', {
      lat: latitude,
      lng: longitude,
      radius_km: radiusKm,
      result_limit: limit,
    })
  }

  async searchVenues(keyword: string, limit: number = 20) {
    return supabase
      .from<Venue>('venues')
      .select('*')
      .ilike('name', `%${keyword}%`)
      .eq('status', 'active')
      .order('created_at', false)
      .limit(limit)
      .execute()
  }

  async getVenueById(id: string) {
    return supabase.from<Venue>('venues').select('*').eq('id', id).single().execute()
  }

  async getVenuesByCategory(category: VenueCategory, limit: number = 20) {
    return supabase
      .from<Venue>('venues')
      .select('*')
      .eq('category', category)
      .eq('status', 'active')
      .order('created_at', false)
      .limit(limit)
      .execute()
  }

  async getSubVenues(parentId: string) {
    return supabase
      .from<Venue>('venues')
      .select('*')
      .eq('parent_id', parentId)
      .eq('status', 'active')
      .execute()
  }

  async getHotVenues(limit: number = 10) {
    return supabase.rpc<VenueWithDistance[]>('get_hot_venues', {
      result_limit: limit,
    })
  }
}

class PostService {
  async getPostsByVenue(venueId: string, limit: number = 20, offset: number = 0) {
    return supabase
      .from<Post>('posts')
      .select('*, venues(*)')
      .eq('venue_id', venueId)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', false)
      .limit(limit)
      .offset(offset)
      .execute()
  }

  async getRecentPosts(limit: number = 20, offset: number = 0) {
    return supabase
      .from<PostWithVenue>('posts')
      .select('*, venues(*)')
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', false)
      .limit(limit)
      .offset(offset)
      .execute()
  }

  async getPostsByType(type: PostType, venueId: string, limit: number = 20) {
    return supabase
      .from<Post>('posts')
      .select('*')
      .eq('venue_id', venueId)
      .eq('type', type)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', false)
      .limit(limit)
      .execute()
  }

  async createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'like_count' | 'view_count' | 'status'>) {
    return supabase.from<Post>('posts').insert({
      ...post,
      status: 'active',
      like_count: 0,
      view_count: 0,
    }).execute()
  }

  async incrementViewCount(postId: string) {
    return supabase.rpc('increment_post_view', { post_id: postId })
  }

  async incrementLikeCount(postId: string) {
    return supabase.rpc('increment_post_like', { post_id: postId })
  }

  async deletePost(postId: string) {
    return supabase
      .from<Post>('posts')
      .update({ status: 'deleted' })
      .eq('id', postId)
      .execute()
  }
}

class ApplicationService {
  async getMyApplications(status?: ApplicationStatus, limit: number = 20, offset: number = 0) {
    let query = supabase
      .from<Application>('applications')
      .select('*')
      .order('created_at', false)
      .limit(limit)
      .offset(offset)

    if (status) {
      query = query.eq('status', status) as typeof query
    }

    return query.execute()
  }

  async createApplication(application: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'status' | 'review_note' | 'reviewed_at' | 'reviewed_by'>) {
    return supabase.from<Application>('applications').insert({
      ...application,
      status: 'pending',
    }).execute()
  }

  async getApplicationById(id: string) {
    return supabase.from<Application>('applications').select('*').eq('id', id).single().execute()
  }
}

class FavoriteService {
  async getMyFavorites(limit: number = 20, offset: number = 0) {
    return supabase
      .from<UserFavoriteWithVenue>('user_favorites')
      .select('*, venues(*)')
      .order('created_at', false)
      .limit(limit)
      .offset(offset)
      .execute()
  }

  async addFavorite(venueId: string) {
    return supabase.from<UserFavorite>('user_favorites').insert({
      venue_id: venueId,
    }).execute()
  }

  async removeFavorite(venueId: string) {
    return supabase.from<UserFavorite>('user_favorites').delete().eq('venue_id', venueId).execute()
  }

  async isFavorited(venueId: string) {
    const result = await supabase
      .from<UserFavorite>('user_favorites')
      .select('id')
      .eq('venue_id', venueId)
      .limit(1)
      .execute()

    return {
      data: (result.data?.length ?? 0) > 0,
      error: result.error,
      status: result.status,
    }
  }
}

class UserService {
  async getProfile() {
    return supabase.from<UserProfile>('user_profiles').select('*').single().execute()
  }

  async updateProfile(profile: Partial<UserProfile>) {
    return supabase.from<UserProfile>('user_profiles').update(profile).execute()
  }

  async createProfile(profile: Omit<UserProfile, 'created_at' | 'updated_at'>) {
    return supabase.from<UserProfile>('user_profiles').insert(profile).execute()
  }
}

export const venueService = new VenueService()
export const postService = new PostService()
export const applicationService = new ApplicationService()
export const favoriteService = new FavoriteService()
export const userService = new UserService()
