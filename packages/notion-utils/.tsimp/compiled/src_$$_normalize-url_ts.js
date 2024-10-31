import mem from 'mem';
import normalizeUrlImpl from 'normalize-url';
export const normalizeUrl = mem((url) => {
    if (!url) {
        return '';
    }
    try {
        if (url.startsWith('https://www.notion.so/image/')) {
            const u = new URL(url);
            const subUrl = decodeURIComponent(u.pathname.slice('/image/'.length));
            const normalizedSubUrl = normalizeUrl(subUrl);
            u.pathname = `/image/${encodeURIComponent(normalizedSubUrl)}`;
            url = u.toString();
        }
        return normalizeUrlImpl(url, {
            stripProtocol: true,
            stripWWW: true,
            stripHash: true,
            stripTextFragment: true,
            removeQueryParameters: true
        });
    }
    catch {
        return '';
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ybWFsaXplLXVybC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvdGZpc2NoZXIvZGV2L21vZHVsZXMvcmVhY3Qtbm90aW9uLXgvcGFja2FnZXMvbm90aW9uLXV0aWxzL3NyYy8iLCJzb3VyY2VzIjpbIm5vcm1hbGl6ZS11cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFBO0FBQ3JCLE9BQU8sZ0JBQWdCLE1BQU0sZUFBZSxDQUFBO0FBRTVDLE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFZLEVBQUUsRUFBRTtJQUMvQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDVCxPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDSCxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsRUFBRSxDQUFDO1lBQ25ELE1BQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3RCLE1BQU0sTUFBTSxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1lBQ3JFLE1BQU0sZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQzdDLENBQUMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUE7WUFDN0QsR0FBRyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNwQixDQUFDO1FBRUQsT0FBTyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUU7WUFDM0IsYUFBYSxFQUFFLElBQUk7WUFDbkIsUUFBUSxFQUFFLElBQUk7WUFDZCxTQUFTLEVBQUUsSUFBSTtZQUNmLGlCQUFpQixFQUFFLElBQUk7WUFDdkIscUJBQXFCLEVBQUUsSUFBSTtTQUM1QixDQUFDLENBQUE7SUFDSixDQUFDO0lBQUMsTUFBTSxDQUFDO1FBQ1AsT0FBTyxFQUFFLENBQUE7SUFDWCxDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUEifQ==