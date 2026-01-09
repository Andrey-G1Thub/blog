import { useLayoutEffect, useRef, useState } from 'react';
import { Icon, Input } from '../../../../components';
import { SpecialPanel } from '../special-panel/special-panel';
import { sanizeContent } from './utils/sanitize-content';
import { useDispatch } from 'react-redux';
import { savePostAsync } from '../../../../actions';
import { useNavigate } from 'react-router-dom';
import { PROP_TYPE } from '../../../../constants';
import styled from 'styled-components';

const PostFormContainer = ({
	className,
	post: { id, title, imageUrl, content, publishedAt },
}) => {
	const [imageUrlValue, setImageUrlValue] = useState(imageUrl);
	const [titleValue, setTitleValue] = useState(title);
	const [imageFile, setImageFile] = useState(null);
	const contentRef = useRef(null);

	useLayoutEffect(() => {
		setImageUrlValue(imageUrl);
		setTitleValue(title);
	}, [imageUrl, title]);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSave = () => {
		const newContent = sanizeContent(contentRef.current.innerHTML);

		const formData = new FormData();
		formData.append('title', titleValue);
		formData.append('content', newContent);

		if (imageFile) {
			formData.append('image', imageFile);
		} else {
			formData.append('imageUrl', imageUrlValue);
		}

		dispatch(savePostAsync(id, formData)).then((post) => {
			if (post && post.id) {
				navigate(`/post/${post.id}`);
			}
		});
	};

	const onImageChange = ({ target }) => {
		// Если это выбор файла
		if (target.files) {
			setImageFile(target.files[0]);
			setImageUrlValue(target.value);
			return;
		}
		setImageUrlValue(target.value);
	};
	const onTitleChange = ({ target }) => setTitleValue(target.value);

	return (
		<div className={className}>
			<Input
				type="file"
				placeholder="Выберите изображение или вставьте ссылку..."
				onChange={onImageChange}
				accept="image/*"
			/>
			<Input
				value={titleValue}
				placeholder="Заголовок..."
				onChange={onTitleChange}
			/>
			<SpecialPanel
				id={id}
				publishedAt={publishedAt}
				margin="20px 0"
				editButton={
					<Icon
						id="fa-floppy-o"
						size="21px"
						margin="0 10px 0 0"
						onClick={onSave}
						title="Сохранить изменения"
					/>
				}
			/>
			<div
				ref={contentRef}
				contentEditable={true}
				suppressContentEditableWarning={true}
				className="post-text"
			>
				{content}
			</div>
		</div>
	);
};

export const PostForm = styled(PostFormContainer)`
	& img {
		float: left;
		margin: 0 20px 10px 0;
	}

	& .post-text {
		min-height: 80px;
		border: 1px solid #000;
		font-size: 18px;
		white-space: pre-line;
	}
`;
PostForm.propTypes = {
	post: PROP_TYPE.POST.isRequired,
};
