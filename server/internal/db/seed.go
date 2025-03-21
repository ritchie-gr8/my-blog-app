package db

import (
	"context"
	"fmt"
	"log"
	"math/rand"

	"github.com/ritchie-gr8/my-blog-app/internal/store"
)

var usernames = []string{
	"Skylar45", "NightHawk22", "BlueFlame", "GigaStorm7", "ElectricDawn",
	"SilentWolf1", "IronPhoenix", "LunarEclipse", "StealthWarrior", "ViperQueen",
	"TurboKnight", "ShadowWalker", "StormBringer", "MysticTiger", "RogueEcho",
	"QuantumX", "SolarFlare55", "CrimsonFury", "BlazeForce", "FrostNova",
	"ThunderBolt9", "SwiftArrow", "SilverWolf2", "CosmicDragon", "InfernoBlaze",
	"VenomousStrike", "Firehawk26", "DarkPhoenix", "LightningBolt", "IronClad79",
	"StealthShade", "RebelSoul", "ElectricFury", "ShadowFire", "MysticFalcon",
	"GlitchMaster", "EchoKnight", "SolarSaber", "DragonSoul33", "Frostbite13",
	"VortexRider", "DarkKnightX", "VenomStrike45", "ThunderClash", "StormRider",
	"QuantumDrift", "ShadowFlare", "RagingStorm", "IcePhoenix", "NovaStrike",
	"SilverShadowX", "PhantomGhost", "ZenithEdge", "CrimsonEcho", "BlazePhoenix",
}

var titles = []string{
	"5 Tips for a Productive Morning Routine",
	"How to Stay Motivated When Working From Home",
	"The Best Healthy Snacks for Busy Days",
	"Simple Ways to Boost Your Creativity",
	"How to Make Time for Self-Care Every Day",
	"The Power of a Good Night’s Sleep",
	"Easy Recipes for Quick Weeknight Dinners",
	"How to Organize Your Workspace for Maximum Efficiency",
	"Ways to Stay Active Without Going to the Gym",
	"Why Journaling Can Improve Your Mental Health",
	"How to Build a Minimalist Wardrobe",
	"Top 5 Podcasts for Personal Growth",
	"How to Plan Your Day for Success",
	"The Benefits of Spending Time Outdoors",
	"How to Manage Stress in Your Everyday Life",
	"Tips for Setting Realistic Goals You Can Achieve",
	"Why You Should Start Meditating Today",
	"Simple Hacks for Better Time Management",
	"How to Create a Budget That Actually Works",
	"How to Cultivate Gratitude in Your Life",
}

var introductions = []string{
	"Starting your day with a clear routine can set the tone for productivity and well-being. Here are some tips to kick-start your mornings.",
	"Staying motivated while working from home can be challenging. In this post, we'll explore some strategies to stay on track and stay productive.",
	"Eating healthy doesn’t have to be complicated. In this post, we’ll share some quick and easy snack ideas that are both nutritious and delicious.",
	"Creativity isn't something reserved for artists—it’s something everyone can tap into. Here are some simple ways to boost your creativity every day.",
	"Self-care is more than just bubble baths and spa days. It’s about taking small steps to nurture yourself. Let’s dive into some easy self-care routines.",
	"Sleep is the foundation of good health. In this post, we’ll explore why getting enough sleep is crucial and how you can improve your sleep quality.",
	"Dinner doesn't have to be a time-consuming ordeal. Here are a few quick and healthy meal ideas that can be made in 30 minutes or less.",
	"A cluttered workspace can lead to a cluttered mind. Let's explore how organizing your workspace can help you stay focused and productive.",
	"You don’t need a gym membership to stay fit. In this post, we’ll explore some simple ways to stay active without leaving home.",
	"Journaling isn’t just about writing your thoughts down; it’s a powerful tool for improving mental health and creativity. Here’s why you should start journaling today.",
}

var contents = []string{
	"Start your day with intention. Set aside time for activities that inspire and energize you, like a morning workout or meditation.",
	"Staying motivated at home can be challenging. Create a dedicated workspace, set a routine, and take regular breaks.",
	"Busy days don't have to mean unhealthy snacks. Try nuts, fruit, or yogurt for a quick and nutritious pick-me-up.",
	"To boost creativity, try stepping outside your comfort zone, experimenting with new activities, or collaborating with others.",
	"Self-care doesn't need to be complicated. Set aside at least 10 minutes each day for activities that help you recharge.",
	"Quality sleep is essential for both physical and mental health. Establish a bedtime routine, avoid screens, and aim for consistency.",
	"Quick, healthy meals are possible with a little prep. Try making grain bowls or one-pan meals that are easy to assemble and delicious.",
	"An organized workspace leads to an organized mind. Declutter your desk, make use of storage solutions, and keep it tidy.",
	"You don't need a gym membership to stay active. Go for a walk, do bodyweight exercises, or try yoga at home.",
	"Journaling helps to process thoughts and reduce anxiety. Write down your feelings, ideas, or simply jot a few notes about your day.",
	"Building a minimalist wardrobe is all about focusing on quality over quantity. Stick to versatile, timeless pieces.",
	"Podcasts are a great way to learn while on the go. Explore topics like self-improvement, entrepreneurship, and creativity for personal growth.",
	"Start each day by identifying the top 3 tasks you want to accomplish. This helps to prioritize your time and stay focused.",
	"Being outside does wonders for your mood. Whether it's a walk in the park or hiking, fresh air and nature can improve mental clarity.",
	"Stress management is key to a balanced life. Try breathing exercises, mindfulness, or even a hobby to unwind and reduce tension.",
	"Set clear, achievable goals and break them down into smaller steps. Celebrate each milestone to stay motivated and on track.",
	"Meditation can help calm the mind and improve focus. Even a few minutes each day can lead to significant benefits.",
	"Time management is a skill. Use techniques like the Pomodoro method, prioritize tasks, and avoid distractions to work efficiently.",
	"Financial planning doesn't have to be intimidating. Track your spending, set clear goals, and adjust your budget as needed.",
	"Gratitude shifts your perspective. Write down three things you're grateful for each day to cultivate a positive mindset.",
	"Staying organized doesn’t mean being perfect. Use tools like calendars, to-do lists, and reminders to stay on top of your tasks.",
}

var categories = []string{
	"Productivity",
	"Motivation",
	"Health",
	"Creativity",
	"Self-Care",
	"Sleep",
	"Recipes",
	"Organization",
	"Fitness",
	"Mental Health",
	"Minimalism",
	"Personal Growth",
	"Time Management",
	"Outdoor Activities",
	"Stress Management",
	"Goal Setting",
	"Meditation",
	"Budgeting",
	"Gratitude",
	"Life Hacks",
}

var comments = []string{
	"Great post! Really helpful information.",
	"I love this idea! I’m definitely going to try it.",
	"This is exactly what I needed today. Thank you!",
	"Amazing tips! I can’t wait to put them into practice.",
	"I completely agree with your point on self-care.",
	"Thanks for sharing this, it’s so inspiring.",
	"Such a useful read, I learned a lot!",
	"I had never thought about it that way. Great perspective!",
	"This is so relatable, I feel the same way.",
	"Awesome content! Can’t wait for the next post.",
}

func Seed(store store.Storage) {
	ctx := context.Background()

	users := generateUsers(100)
	for _, user := range users {
		if err := store.Users.Create(ctx, user); err != nil {
			log.Println("Error creating user:", err)
			return
		}
	}

	posts := generatePosts(200, users)
	for _, post := range posts {
		if err := store.Posts.Create(ctx, post); err != nil {
			log.Println("Error creating user:", err)
			return
		}
	}

	comments := generateComments(500, users, posts)
	for _, comment := range comments {
		if err := store.Comments.Create(ctx, comment); err != nil {
			log.Println("Error creating comment:", err)
			return
		}
	}

	log.Println("Seeding completed.")
}

func generateUsers(num int) []*store.User {
	users := make([]*store.User, num)

	for i := range num {
		random := usernames[i%len(usernames)] + fmt.Sprintf("%d", i)
		users[i] = &store.User{
			Name:     random,
			Username: random,
			Email:    random + "@example.com",
			Password: "123123",
		}
	}

	return users
}

func generatePosts(num int, users []*store.User) []*store.Post {
	posts := make([]*store.Post, num)

	for i := range num {
		user := users[rand.Intn(len(users))]

		posts[i] = &store.Post{
			UserID:       user.ID,
			Title:        titles[rand.Intn(len(titles))],
			Introduction: introductions[rand.Intn(len(introductions))],
			Content:      contents[rand.Intn(len(contents))],
			Category:     categories[rand.Intn(len(categories))],
		}
	}

	return posts
}

func generateComments(num int, users []*store.User, posts []*store.Post) []*store.Comment {
	cms := make([]*store.Comment, num)

	for i := range num {
		cms[i] = &store.Comment{
			PostID:  posts[rand.Intn(len(posts))].ID,
			UserID:  users[rand.Intn(len(users))].ID,
			Content: comments[rand.Intn(len(comments))],
		}
	}

	return cms
}
