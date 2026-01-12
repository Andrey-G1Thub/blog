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
	const [isSaving, setIsSaving] = useState(false);
	const contentRef = useRef(null);

	useLayoutEffect(() => {
		setImageUrlValue(imageUrl);
		setTitleValue(title);
	}, [imageUrl, title]);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSave = () => {
		if (isSaving) return;
		const newContent = sanizeContent(contentRef.current.innerHTML);

		setIsSaving(true);

		const formData = new FormData();
		formData.append('title', titleValue);
		formData.append('content', newContent);

		if (imageFile) {
			formData.append('image', imageFile);
		} else if (imageUrlValue && imageUrlValue.trim() !== '') {
			formData.append('imageUrl', imageUrlValue);
		}

		dispatch(savePostAsync(id, formData))
			.then((post) => {
				if (post && post.id) {
					navigate(`/post/${post.id}`);
				}
			})
			.finally(() => {
				setIsSaving(false);
			});
	};

	const onFileChange = ({ target }) => {
		if (target.files && target.files.length > 0) {
			setImageFile(target.files[0]);
			setImageUrlValue('');
		} else {
			setImageFile(null);
		}
	};

	const onUrlChange = ({ target }) => {
		setImageUrlValue(target.value);
		setImageFile(null);
	};
	const onClearImage = () => {
		setImageFile(null);
		setImageUrlValue('');
	};
	const onTitleChange = ({ target }) => setTitleValue(target.value);

	const isUrlDisabled = !!imageFile;
	const isFileDisabled = !!imageUrlValue && imageUrlValue.trim() !== '';

	return (
		<div className={className}>
			<div className="input-row">
				<label className={`file-upload ${isFileDisabled ? 'disabled' : ''}`}>
					<Icon id="fa-upload" size="18px" margin="0 10px 0 0" />
					<span>
						{imageFile
							? `Выбран файл: ${imageFile.name}`
							: 'Загрузить картинку '}
					</span>
					<input
						type="file"
						onChange={onFileChange}
						accept="image/*"
						disabled={isFileDisabled}
						hidden
					/>
					{imageFile && (
						<Icon
							id="fa-trash-o"
							size="18px"
							margin="0 0 0 10px"
							onClick={onClearImage}
							title="Удалить выбранное изображение"
						/>
					)}
				</label>
			</div>

			{/*  Поле для ссылки */}
			<div className="input-row">
				<Input
					value={imageUrlValue}
					placeholder="Или вставьте ссылку на изображение..."
					onChange={onUrlChange}
					disabled={isUrlDisabled}
				/>
			</div>
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
						style={{
							opacity: isSaving ? 0.5 : 1,
							cursor: isSaving ? 'not-allowed' : 'pointer',
						}}
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
	display: flex;
	flex-direction: column;
	gap: 15px;

	& .input-row {
		width: 100%;
	}

	& .file-upload {
		display: inline-flex;
		align-items: center;
		padding: 12px 20px;
		border: 1px dashed #a1a1a1;
		border-radius: 5px;
		cursor: pointer;
		background-color: #f9f9f9;
		font-size: 14px;
		transition: all 0.2s;
		width: 100%;
		box-sizing: border-box;

		&:hover {
			background-color: #f0f0f0;
			border-color: #666;
		}

		&.disabled {
			opacity: 0.4;
			cursor: not-allowed;
			background-color: #eee;
		}
	}

	& .post-text {
		min-height: 80px;
		border: 1px solid #000;
		padding: 15px;
		font-size: 18px;
		white-space: pre-line;
		background: #fff;
	}
`;
PostForm.propTypes = {
	post: PROP_TYPE.POST.isRequired,
};
