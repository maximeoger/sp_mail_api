module.exports = {
	transform: {
		'^.+\\.ts$': 'ts-jest'
	},
	moduleFileExtensions: [
		'js',
		'ts'
	],
	testMatch: [
		'**/__tests__/**/*.test.(ts|js)'
	],
	testEnvironment: 'node'
}