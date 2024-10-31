import test from 'ava';
import { NotionAPI } from './notion-api';
const pageIdFixturesSuccess = [
    '067dd719-a912-471e-a9a3-ac10710e7fdf',
    '067dd719a912471ea9a3ac10710e7fdf',
    'https://www.notion.so/saasifysh/Embeds-5d4e290ca4604d8fb809af806a6c1749',
    'https://www.notion.so/saasifysh/File-Uploads-34d650c65da34f888335dbd3ddd141dc',
    'Color-Rainbow-54bf56611797480c951e5c1f96cb06f2',
    'e68c18a461904eb5a2ddc3748e76b893',
    'https://www.notion.so/saasifysh/Saasify-Key-Takeaways-689a8abc1afa4699905aa2f2e585e208',
    'https://www.notion.so/saasifysh/TransitiveBullsh-it-78fc5a4b88d74b0e824e29407e9f1ec1',
    'https://www.notion.so/saasifysh/About-8d0062776d0c4afca96eb1ace93a7538',
    'https://www.notion.so/potionsite/newest-board-a899b98b7cdc424585e5ddebbdae60cc'
    // collections stress test
    // NOTE: removing because of sporadic timeouts
    // 'nba-3f92ae505636427c897634a15b9f2892'
];
const pageIdFixturesFailure = [
    'bdecdf150d0e40cb9f3412be132335d4', // private page
    'foo' // invalid page id
];
for (const pageId of pageIdFixturesSuccess) {
    test(`NotionAPI.getPage success ${pageId}`, async (t) => {
        t.timeout(60_000); // one minute timeout
        const api = new NotionAPI();
        const page = await api.getPage(pageId);
        t.truthy(page);
        t.truthy(page.block);
    });
}
for (const pageId of pageIdFixturesFailure) {
    test(`NotionAPI.getPage failure ${pageId}`, async (t) => {
        const api = new NotionAPI();
        await t.throwsAsync(() => api.getPage(pageId));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aW9uLWFwaS50ZXN0LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy90ZmlzY2hlci9kZXYvbW9kdWxlcy9yZWFjdC1ub3Rpb24teC9wYWNrYWdlcy9ub3Rpb24tY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbIm5vdGlvbi1hcGkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLElBQUksTUFBTSxLQUFLLENBQUE7QUFFdEIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQTtBQUV4QyxNQUFNLHFCQUFxQixHQUFHO0lBQzVCLHNDQUFzQztJQUN0QyxrQ0FBa0M7SUFDbEMseUVBQXlFO0lBQ3pFLCtFQUErRTtJQUMvRSxnREFBZ0Q7SUFDaEQsa0NBQWtDO0lBQ2xDLHdGQUF3RjtJQUN4RixzRkFBc0Y7SUFDdEYsd0VBQXdFO0lBQ3hFLGdGQUFnRjtJQUVoRiwwQkFBMEI7SUFDMUIsOENBQThDO0lBQzlDLHlDQUF5QztDQUMxQyxDQUFBO0FBRUQsTUFBTSxxQkFBcUIsR0FBRztJQUM1QixrQ0FBa0MsRUFBRSxlQUFlO0lBQ25ELEtBQUssQ0FBQyxrQkFBa0I7Q0FDekIsQ0FBQTtBQUVELEtBQUssTUFBTSxNQUFNLElBQUkscUJBQXFCLEVBQUUsQ0FBQztJQUMzQyxJQUFJLENBQUMsNkJBQTZCLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN0RCxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUMscUJBQXFCO1FBRXZDLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUE7UUFDM0IsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRXRDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDZCxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUN0QixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxLQUFLLE1BQU0sTUFBTSxJQUFJLHFCQUFxQixFQUFFLENBQUM7SUFDM0MsSUFBSSxDQUFDLDZCQUE2QixNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDdEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQTtRQUMzQixNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBQ2hELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyJ9