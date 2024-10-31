import test from 'ava';
import { normalizeUrl } from './normalize-url';
test('normalizeUrl invalid', (t) => {
    t.is(normalizeUrl(), '');
    t.is(normalizeUrl(''), '');
    t.is(normalizeUrl('#'), '');
    t.is(normalizeUrl('#foo'), '');
    t.is(normalizeUrl('/foo'), '');
    t.is(normalizeUrl('/foo/bar'), '');
    t.is(normalizeUrl('://test.com'), '');
});
test('normalizeUrl valid', (t) => {
    const fixtures = [
        'test.com',
        'test.com/123',
        '//test.com',
        'https://test.com',
        'https://www.test.com',
        'https://test.com/foo/bar',
        'https://test.com/foo/bar/',
        'https://test.com/foo/bar?foo=bar&cat=dog',
        'https://www.notion.so/image/https%3A%2F%2Fs3.us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fae16c287-668f-4ea7-90a8-5ed96302e14f%2Fquilt-opt.jpg%3FX-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Content-Sha256%3DUNSIGNED-PAYLOAD%26X-Amz-Credential%3DAKIAT73L2G45EIPT3X45%252F20220327%252Fus-west-2%252Fs3%252Faws4_request%26X-Amz-Date%3D20220327T124856Z%26X-Amz-Expires%3D86400%26X-Amz-Signature%3Dfdaa47d722db4b4052267d999003c6392bbd3d8c4169268b202b8268b2af12ab%26X-Amz-SignedHeaders%3Dhost%26x-id%3DGetObject?table=block&id=ddec4f2d-6afa-498f-8141-405647e02ea5&cache=v2'
    ];
    for (const url of fixtures) {
        const normalizedUrl = normalizeUrl(url);
        t.truthy(normalizedUrl);
        t.snapshot(normalizedUrl);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ybWFsaXplLXVybC50ZXN0LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy90ZmlzY2hlci9kZXYvbW9kdWxlcy9yZWFjdC1ub3Rpb24teC9wYWNrYWdlcy9ub3Rpb24tdXRpbHMvc3JjLyIsInNvdXJjZXMiOlsibm9ybWFsaXplLXVybC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQTtBQUV0QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUE7QUFFOUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDakMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUN4QixDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUMxQixDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUMzQixDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUM5QixDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUM5QixDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUNsQyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUN2QyxDQUFDLENBQUMsQ0FBQTtBQUVGLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO0lBQy9CLE1BQU0sUUFBUSxHQUFHO1FBQ2YsVUFBVTtRQUNWLGNBQWM7UUFDZCxZQUFZO1FBQ1osa0JBQWtCO1FBQ2xCLHNCQUFzQjtRQUN0QiwwQkFBMEI7UUFDMUIsMkJBQTJCO1FBQzNCLDBDQUEwQztRQUMxQyw4akJBQThqQjtLQUMvakIsQ0FBQTtJQUVELEtBQUssTUFBTSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDM0IsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3ZDLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDdkIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUMzQixDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUEifQ==