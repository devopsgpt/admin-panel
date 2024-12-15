import { useGet } from '@/core/react-query';

type UseDownloadProps = {
  folderName: string;
  source: string;
};

const useDownload = ({ folderName, source }: UseDownloadProps) => {
  const { mutateAsync, isSuccess, isPending } = useGet<string, undefined>(
    `/download-folder${folderName}/${source}`,
    'download',
    undefined,
    { responseType: 'blob' },
  );

  const download = async ({ fileName }: { fileName: string }) => {
    try {
      const data = await mutateAsync(undefined);
      const blob = new Blob([data.data], {
        type: data.headers['Content-Type'] as string,
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      return error;
    }
  };

  return { download, isSuccess, isPending };
};

export default useDownload;
