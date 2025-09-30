import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
    try {
        const { userId } = await req.auth();
        
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Get user data
        const user = await clerkClient.users.getUser(userId);
        
        // Check if user has premium subscription in metadata
        let plan = user.privateMetadata?.plan || user.publicMetadata?.plan || 'free';
        
        if (plan === 'premium') {
            req.plan = 'premium';
            req.free_usage = 0; // Premium users have no limit
        } else {
            req.plan = 'free';
            
            // Handle free usage tracking for free users
            if (user.privateMetadata && typeof user.privateMetadata.free_usage !== 'undefined') {
                req.free_usage = user.privateMetadata.free_usage;
            } else {
                // Initialize free_usage to 0 for new free users
                req.free_usage = 0;
                await clerkClient.users.updateUserMetadata(userId, {
                    privateMetadata: {
                        free_usage: 0
                    }
                });
            }
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};