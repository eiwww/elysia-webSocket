export function TestRoute(app: any) {
	return app.get("/", () =>
		"Today is Friday in Califonia",
		{
			detail: {
				tags: ['Test']
			}
		}
	)
}